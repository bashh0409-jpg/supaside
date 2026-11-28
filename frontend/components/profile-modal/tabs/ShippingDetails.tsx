"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createSupabaseBrowserClient } from "../../../lib/supabase/browser";
import { useDialogBehavior } from "../../../lib/useDialogBehavior";

type ShippingAddress = {
  id: number;
  recipient: string;
  line1: string;
  line2: string | null;
  suburb: string | null;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean | null;
};

type AddressForm = {
  recipient: string;
  line1: string;
  line2: string;
  suburb: string;
  city: string;
  province: string;
  postal_code: string;
};

type ShippingDetailsProps = {
  userId: string;
  showControls?: boolean;
};

const provinces = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

const emptyAddress: AddressForm = {
  recipient: "",
  line1: "",
  line2: "",
  suburb: "",
  city: "",
  province: "",
  postal_code: "",
};

const fields: {
  key: keyof AddressForm;
  label: string;
  required?: boolean;
}[] = [
  { key: "recipient", label: "Recipient", required: true },
  { key: "line1", label: "Address line 1", required: true },
  { key: "line2", label: "Address line 2" },
  { key: "suburb", label: "Suburb" },
  { key: "city", label: "City", required: true },
  { key: "province", label: "Province", required: true },
  { key: "postal_code", label: "Postal code", required: true },
];

function getSaveErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const { message, details, hint, code } = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };
    const description = message ?? details ?? hint;
    if (description) {
      return code ? `${description} (${code})` : description;
    }
  }
  return "Unable to save shipping details.";
}

export default function ShippingDetails({
  userId,
  showControls = true,
}: ShippingDetailsProps) {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<AddressForm>(emptyAddress);
  const recipientRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    async function loadAddresses() {
      try {
        const supabase = createSupabaseBrowserClient();
        if (!supabase) {
          throw new Error("Supabase is not configured");
        }

        const { data, error } = await supabase
          .from("addresses")
          .select(
            "id, recipient, line1, line2, suburb, city, province, postal_code, is_default",
          )
          .eq("user_id", userId)
          .order("is_default", { ascending: false, nullsFirst: false })
          .order("id", { ascending: true });

        if (error) {
          throw error;
        }

        if (active) {
          setAddresses(data ?? []);
        }
      } catch (error) {
        console.error("Unable to load shipping addresses:", error);
        if (active) {
          setErrorMessage("Unable to load saved shipping details.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadAddresses();
    return () => {
      active = false;
    };
  }, [userId]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(null);
    setConfirmDelete(false);
    setForm(emptyAddress);
    setErrorMessage(null);
  }, []);

  useDialogBehavior(modalOpen, closeModal, recipientRef);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyAddress);
    setMessage(null);
    setErrorMessage(null);
    setModalOpen(true);
  }

  function openEditModal(address: ShippingAddress) {
    setEditingId(address.id);
    setConfirmDelete(false);
    setForm({
      recipient: address.recipient,
      line1: address.line1,
      line2: address.line2 ?? "",
      suburb: address.suburb ?? "",
      city: address.city,
      province: address.province,
      postal_code: address.postal_code,
    });
    setMessage(null);
    setErrorMessage(null);
    setModalOpen(true);
  }

  function updateField(field: keyof AddressForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrorMessage(null);
  }

  async function deleteAddress() {
    if (!editingId) {
      return;
    }

    setDeleting(true);
    setErrorMessage(null);
    try {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        throw new Error("Supabase is not configured");
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Sign in again before deleting shipping details.");
      }

      const address = addresses.find((item) => item.id === editingId);
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", editingId)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      const remaining = addresses.filter((item) => item.id !== editingId);
      if (address?.is_default && remaining.length > 0) {
        const nextDefault = remaining[0];
        const { data: updatedDefault, error: defaultError } = await supabase
          .from("addresses")
          .update({ is_default: true })
          .eq("id", nextDefault.id)
          .eq("user_id", user.id)
          .select(
            "id, recipient, line1, line2, suburb, city, province, postal_code, is_default",
          )
          .single();

        if (!defaultError && updatedDefault) {
          setAddresses(
            remaining.map((item) =>
              item.id === updatedDefault.id ? updatedDefault : item,
            ),
          );
        } else {
          setAddresses(remaining);
        }
      } else {
        setAddresses(remaining);
      }

      setMessage("Shipping address deleted.");
      closeModal();
    } catch (error) {
      console.error("Unable to delete shipping address:", error);
      setErrorMessage(getSaveErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  async function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    for (const field of fields) {
      if (field.required && !form[field.key].trim()) {
        setErrorMessage(`${field.label} is required.`);
        return;
      }
    }

    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        throw new Error("Supabase is not configured");
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Sign in again before saving shipping details.");
      }

      const { data: profile, error: profileLookupError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (profileLookupError) {
        throw profileLookupError;
      }

      if (!profile) {
        const { error: profileInsertError } = await supabase
          .from("profiles")
          .insert({ id: user.id });

        if (profileInsertError) {
          throw profileInsertError;
        }
      }

      const values = {
        recipient: form.recipient.trim(),
        line1: form.line1.trim(),
        line2: form.line2.trim() || null,
        suburb: form.suburb.trim() || null,
        city: form.city.trim(),
        province: form.province.trim(),
        postal_code: form.postal_code.trim(),
      };

      if (editingId) {
        const { data, error } = await supabase
          .from("addresses")
          .update(values)
          .eq("id", editingId)
          .eq("user_id", user.id)
          .select(
            "id, recipient, line1, line2, suburb, city, province, postal_code, is_default",
          )
          .single();

        if (error) {
          throw error;
        }

        setAddresses((current) =>
          current.map((address) => (address.id === editingId ? data : address)),
        );
        setMessage("Shipping details updated.");
      } else {
        const { data, error } = await supabase
          .from("addresses")
          .insert({
            user_id: user.id,
            ...values,
            is_default: addresses.length === 0,
          })
          .select(
            "id, recipient, line1, line2, suburb, city, province, postal_code, is_default",
          )
          .single();

        if (error) {
          throw error;
        }

        setAddresses((current) => [...current, data]);
        setMessage("Shipping details saved.");
      }

      closeModal();
    } catch (error) {
      console.error("Unable to save shipping address:", error);
      setErrorMessage(getSaveErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  function formatAddress(address: ShippingAddress) {
    return [address.line1, address.line2, address.suburb]
      .filter(Boolean)
      .join(", ");
  }

  return (
    <section className={showControls ? "" : ""}>
      {loading ? (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-xs">
            <caption className="sr-only">Your saved shipping addresses</caption>
            <thead>
              <tr className="mute border-b border-gray-200 text-xs uppercase">
                {[
                  "Recipient",
                  "Address",
                  "City",
                  "Province",
                  "Postal code",
                  "Type",
                ].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="pb-3 pr-4 font-semibold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="py-4 font-semibold text-gray-500 ">
                  Loading shipping details…
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {errorMessage && !modalOpen && (
            <p role="alert" className="mb-2 text-sm font-semibold text-red-600">
              {errorMessage}
            </p>
          )}{" "}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-xs">
              <caption className="sr-only">
                Your saved shipping addresses
              </caption>
              <thead>
                <tr className="mute border-b border-gray-200 text-xs uppercase">
                  <th scope="col" className="pb-3 pr-4 font-semibold">
                    Recipient
                  </th>
                  <th scope="col" className="pb-3 pr-4 font-semibold">
                    Address
                  </th>
                  <th scope="col" className="pb-3 pr-4 font-semibold">
                    City
                  </th>
                  <th scope="col" className="pb-3 pr-4 font-semibold">
                    Province
                  </th>
                  <th scope="col" className="pb-3 pr-4 font-semibold">
                    Postal code
                  </th>
                  <th scope="col" className="pb-3 pr-4 font-semibold">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {addresses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className=" font-semibold capitalize py-4 mute"
                    >
                      No addresses saved.
                    </td>
                  </tr>
                ) : (
                  addresses.map((address) => (
                    <tr
                      key={address.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => openEditModal(address)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openEditModal(address);
                        }
                      }}
                      className="cursor-pointer font-semibold capitalize border-b border-gray-200 align-top outline-none focus-visible:bg-black/[0.03]"
                    >
                      <td className="py-3 pr-4 font-semibold">
                        {address.recipient}
                      </td>
                      <td className="max-w-52 py-3 pr-4">
                        {formatAddress(address)}
                      </td>
                      <td className="py-3 pr-4">{address.city}</td>
                      <td className="py-3 pr-4">{address.province}</td>
                      <td className="py-3 pr-4">{address.postal_code}</td>
                      <td className="py-3 pr-4">
                        {address.is_default ? "Default" : "Other"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[1300] flex items-center justify-center p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close shipping details"
            onClick={closeModal}
            className="absolute inset-0 cursor-default bg-black/30 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shipping-details-title"
            className="relative z-10 max-h-[50vh] w-full max-w-md overflow-y-auto rounded-md bg-white p-6 text-zinc-950 shadow-2xl"
          >
            <form onSubmit={saveAddress}>
              <table className="w-full max-w- border-collapse text-left text-sm">
                <tbody>
                  {fields.map((field) => (
                    <tr className="border-b border-gray-200" key={field.key}>
                      <th
                        scope="row"
                        className="w-1/3 py-1 pr-4 align-middle font-semibold"
                      >
                        {field.label}
                        {field.required ? " *" : ""}
                      </th>
                      <td className="">
                        {field.key === "province" ? (
                          <select
                            value={form.province}
                            required={field.required}
                            onChange={(event) =>
                              updateField("province", event.target.value)
                            }
                            className="w-full font-semibold bg-transparent px-0 outline-none focus:border-black"
                          >
                            <option value=""></option>
                            {provinces.map((province) => (
                              <option key={province} value={province}>
                                {province}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="w-full flex items-center gap-2">
                            :
                            <input
                              ref={
                                field.key === "recipient"
                                  ? recipientRef
                                  : undefined
                              }
                              type="text"
                              value={form[field.key]}
                              required={field.required}
                              onChange={(event) =>
                                updateField(field.key, event.target.value)
                              }
                              placeholder=""
                              className="w-full font-semibold bg-transparent px-0 outline-none focus:border-black"
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex items-center justify-between">
                {editingId &&
                  (confirmDelete ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-red-600">
                        Delete this address?
                      </span>
                      <button
                        type="button"
                        onClick={() => void deleteAddress()}
                        disabled={deleting}
                        className="cursor-pointer text-sm font-semibold text-red-600 underline disabled:cursor-wait disabled:opacity-60"
                      >
                        {deleting ? "Deleting…" : "Confirm"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        disabled={deleting}
                        className="cursor-pointer text-sm font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      className="cursor-pointer text-sm font-semibold text-red-600 underline"
                    >
                      Delete
                    </button>
                  ))}
                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer text-sm font-semibold border border-dashed text-black  px-3 py-0.5 disabled:cursor-wait disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>

              {errorMessage && (
                <p
                  role="alert"
                  className="mt-3 font-medium text-sm text-red-600"
                >
                  {errorMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      )}{" "}
      {showControls && (
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm hidden font-semibold">Shipping details</h2>
          {!loading && (
            <button
              type="button"
              onClick={openAddModal}
              className="cursor-pointer hover:mute p-1 px-2 border border-dashed flex justify-end  text-xs hover:opacity-60 font-semibold"
            >
              Add Address
            </button>
          )}
        </div>
      )}
    </section>
  );
}
