"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { buttonClass } from "@/components/ui/button";
import { ErrorState } from "@/components/common/ErrorState";
import { useDecideReceipt, useSaveFields } from "@/hooks/useReviewActions";
import { withRetryHint, type ApiFailure } from "@/lib/api/errors";
import type { Receipt } from "@/lib/api/types";
import { fromFormValues, receiptFormSchema, toFormValues, type ReceiptFormValues } from "@/lib/validation/receipt-form";

const input =
  "mt-1 block min-h-11 w-full rounded-sm border border-line bg-surface px-3 text-ink placeholder:text-ink-muted";

const toNumber = (value: unknown) => (value === "" || value === null || value === undefined ? null : Number(value));

export function ReviewEditForm({ receipt }: { receipt: Receipt }) {
  const save = useSaveFields(receipt.id);
  const decide = useDecideReceipt(receipt.id);

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues: toFormValues(receipt.data),
  });
  const { register, handleSubmit, control, formState } = form;
  const { fields } = useFieldArray({ control, name: "lineItems" });
  const reviewable = receipt.status === "needs_review";
  const failure = (save.error ?? decide.error) as ApiFailure | null;

  return (
    <form
      onSubmit={handleSubmit((values) => save.mutate(fromFormValues(values, receipt.data)))}
      className="rounded-md border border-line bg-surface p-4 sm:p-6"
    >
      <h2 className="font-serif text-2xl">Fields</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Edit what the model got wrong. Saving sends the values back and the checks re-run on the server.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Vendor</span>
          <input {...register("vendor")} className={input} autoComplete="off" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Date</span>
          <input type="date" {...register("date")} className={`${input} font-mono tabular-nums`} />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Category</span>
          <input {...register("category")} className={input} autoComplete="off" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Currency</span>
          <input {...register("currency")} className={`${input} font-mono uppercase`} maxLength={3} autoComplete="off" />
        </label>
        <div className="grid grid-cols-3 gap-2 sm:col-span-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Subtotal</span>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              {...register("subtotal", { setValueAs: toNumber })}
              className={`${input} text-right font-mono tabular-nums`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Tax</span>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              {...register("tax", { setValueAs: toNumber })}
              className={`${input} text-right font-mono tabular-nums`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Total</span>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              {...register("total", { setValueAs: toNumber })}
              className={`${input} text-right font-mono tabular-nums`}
            />
          </label>
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Line items</legend>
        <div className="mt-2 hidden gap-3 border-b border-line pb-2 text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted sm:grid sm:grid-cols-[1fr_4.5rem_6rem_6.5rem]">
          <span>Description</span>
          <span>Qty</span>
          <span>Unit price</span>
          <span>Line total</span>
        </div>
        <div className="divide-y divide-line">
          {fields.map((field, index) => (
            <div key={field.id} className="grid gap-2 py-3 sm:grid-cols-[1fr_4.5rem_6rem_6.5rem] sm:items-start sm:gap-3">
              <label className="block">
                <span className="text-xs text-ink-muted sm:sr-only">Description</span>
                <input {...register(`lineItems.${index}.description`)} className={input} autoComplete="off" />
                {formState.errors.lineItems?.[index]?.description ? (
                  <p className="mt-1 text-sm text-danger">
                    {formState.errors.lineItems[index]?.description?.message}
                  </p>
                ) : null}
              </label>
              <label className="block">
                <span className="text-xs text-ink-muted sm:sr-only">Qty</span>
                <input
                  type="number"
                  step="1"
                  {...register(`lineItems.${index}.quantity`, { setValueAs: toNumber })}
                  className={`${input} text-right font-mono tabular-nums`}
                />
              </label>
              <label className="block">
                <span className="text-xs text-ink-muted sm:sr-only">Unit price</span>
                <input
                  type="number"
                  step="0.01"
                  {...register(`lineItems.${index}.unitPrice`, { setValueAs: toNumber })}
                  className={`${input} text-right font-mono tabular-nums`}
                />
              </label>
              <label className="block">
                <span className="text-xs text-ink-muted sm:sr-only">Line total</span>
                <input
                  type="number"
                  step="0.01"
                  {...register(`lineItems.${index}.lineTotal`, { setValueAs: toNumber })}
                  className={`${input} text-right font-mono tabular-nums`}
                />
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 space-y-3">
        {failure ? <ErrorState title="That did not save" message={withRetryHint(failure)} /> : null}
        {save.isSuccess && !failure ? (
          <p role="status" className="text-sm text-success">
            Saved. Validation re-ran against the new values.
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => decide.mutate("reject")}
            disabled={!reviewable || decide.isPending}
            className={`${buttonClass("ghost")} w-full sm:w-auto`}
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => decide.mutate("approve")}
            disabled={!reviewable || decide.isPending}
            className={`${buttonClass("secondary")} w-full sm:w-auto`}
          >
            Approve
          </button>
          <button
            type="submit"
            disabled={save.isPending || decide.isPending}
            className={`${buttonClass()} w-full sm:w-auto`}
          >
            {save.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
        {!reviewable ? (
          <p className="text-sm text-ink-muted">
            This receipt is already decided, so approve and reject are closed.
          </p>
        ) : null}
      </div>
    </form>
  );
}
