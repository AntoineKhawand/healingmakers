"use client";

import { useState, useEffect } from "react";
import { useOrderStore, OrderStatus, StoredOrder } from "@/lib/store/orderStore";
import { products } from "@/lib/data/products";
import {
  Package, Search, Lock, LogOut, Edit3, Check, Loader2,
  Plus, Trash2, X, ChevronRight, DollarSign,
  Clock, Truck, CheckCircle2, ShoppingBag, User, MapPin,
  Phone, Mail, StickyNote, ArrowLeft, Copy, AlertTriangle,
  Star, MessageSquare, ThumbsUp, ThumbsDown,
} from "lucide-react";
import { useReviewStore, SubmittedReview } from "@/lib/store/reviewStore";

const ADMIN_PASSWORD = "healing2026";

const STATUS_META: Record<OrderStatus, { label: string; bg: string; text: string; dot: string }> = {
  pending:    { label: "Pending",    bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-400" },
  processing: { label: "Processing", bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400" },
  shipped:    { label: "Shipped",    bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400" },
  delivered:  { label: "Delivered",  bg: "bg-emerald-50",text: "text-emerald-700",dot: "bg-emerald-400" },
};

const STATUS_ORDER: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

const PAYMENT_OPTIONS = [
  { value: "card",      label: "Whish Money" },
  { value: "cod",       label: "Cash on Delivery" },
  { value: "instagram", label: "Instagram DM" },
  { value: "whatsapp",  label: "WhatsApp" },
];

const SOURCE_OPTIONS = [
  { value: "instagram", label: "Instagram DM",  emoji: "📸" },
  { value: "whatsapp",  label: "WhatsApp",       emoji: "💬" },
  { value: "website",   label: "Website / Other",emoji: "🌐" },
];

function StatusPill({ status }: { status: OrderStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${m.bg} ${m.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">{label}</p>
      <div className="text-sm text-charcoal/80">{children}</div>
    </div>
  );
}

// ─── Create Order Modal ───────────────────────────────────────────────────────

interface LineItem { productId: string; size: string; color: string; quantity: number; unitPrice: number; }
const EMPTY_FORM = { fullName: "", email: "", phone: "", address: "", city: "", country: "", zip: "" };

function CreateOrderModal({ onClose }: { onClose: () => void }) {
  const { addOrder } = useOrderStore();
  const [form, setForm]           = useState(EMPTY_FORM);
  const [items, setItems]         = useState<LineItem[]>([{ productId: "", size: "", color: "Black", quantity: 1, unitPrice: 0 }]);
  const [paymentMethod, setPay]   = useState("whatsapp");
  const [source, setSource]       = useState("whatsapp");
  const [status, setStatus]       = useState<OrderStatus>("pending");
  const [shipping, setShipping]   = useState(5);
  const [notes, setNotes]         = useState("");
  const [created, setCreated]     = useState(false);
  const [newOrderId, setOrderId]  = useState("");
  const [copied, setCopied]       = useState(false);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const addLine = () => setItems((p) => [...p, { productId: "", size: "", color: "Black", quantity: 1, unitPrice: 0 }]);
  const removeLine = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));
  const updateLine = (i: number, key: keyof LineItem, value: string | number) =>
    setItems((prev) => prev.map((item, idx) => {
      if (idx !== i) return item;
      const next = { ...item, [key]: value };
      if (key === "productId") {
        const p = products.find((p) => p.id === value);
        next.unitPrice = p?.price ?? 0;
        next.size      = p?.sizes[0] ?? "";
        next.color     = p?.colors[0]?.name ?? "Black";
      }
      return next;
    }));

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const total    = subtotal + shipping;
  const canSubmit = form.fullName.trim() && form.phone.trim() &&
    items.every((i) => i.productId && i.size && i.quantity > 0 && i.unitPrice > 0);

  const submit = () => {
    if (!canSubmit) return;
    const orderId = `HM-${Date.now()}`;
    const cartItems = items.map((line) => {
      const p = products.find((p) => p.id === line.productId)!;
      return { id: `${p.id}-${line.size}-${line.color}`, product: p, size: line.size,
        color: p.colors.find((c) => c.name === line.color) ?? p.colors[0],
        quantity: line.quantity, overridePrice: line.unitPrice };
    });
    addOrder({
      id: orderId, items: cartItems, status, form, paymentMethod, subtotal,
      shippingCost: shipping, discount: 0, total, createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 4 * 86400000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      notes: notes || `Order created manually via ${SOURCE_OPTIONS.find((s) => s.value === source)?.label}`,
    });
    setOrderId(orderId);
    setCreated(true);
  };

  const copyId = () => { navigator.clipboard.writeText(newOrderId); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="fixed inset-0 z-[60] flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel — slides in from right */}
      <div className="relative ml-auto w-full max-w-lg h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-sand bg-white shrink-0">
          <button onClick={onClose} className="p-1.5 hover:bg-cream rounded-lg transition-colors">
            <ArrowLeft size={17} className="text-charcoal/60" />
          </button>
          <div>
            <h2 className="font-playfair text-lg font-bold text-soft-black leading-tight">Create Order</h2>
            <p className="text-[11px] text-charcoal/50">Instagram DM · WhatsApp · Manual</p>
          </div>
        </div>

        {created ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
              <CheckCircle2 size={36} className="text-emerald-500" />
            </div>
            <p className="font-playfair text-2xl font-bold text-soft-black mb-2">Order Created!</p>
            <p className="text-sm text-charcoal/60 mb-5 max-w-xs">
              Share this tracking ID with the customer so they can follow their order.
            </p>
            <div className="bg-cream border border-sand rounded-2xl px-5 py-4 mb-6 w-full max-w-xs">
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Order ID</p>
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-base font-bold text-dusty-rose">{newOrderId}</p>
                <button onClick={copyId} className="flex items-center gap-1 text-xs font-semibold text-charcoal/50 hover:text-dusty-rose transition-colors">
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
            </div>
            <button onClick={onClose} className="px-8 py-3 bg-soft-black text-white rounded-xl text-sm font-semibold hover:bg-charcoal transition-colors">
              Done
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Source */}
            <div>
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2.5">Order Source</p>
              <div className="flex gap-2 flex-wrap">
                {SOURCE_OPTIONS.map(({ value, label, emoji }) => (
                  <button key={value} onClick={() => setSource(value)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                      source === value ? "bg-soft-black text-white border-soft-black" : "border-sand text-charcoal/60 hover:border-charcoal/30"
                    }`}
                  >
                    <span>{emoji}</span> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer */}
            <div>
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2.5">Customer Info</p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { key: "fullName", label: "Full Name *",        span: true },
                  { key: "phone",    label: "Phone / WhatsApp *" },
                  { key: "email",    label: "Email" },
                  { key: "address",  label: "Address",            span: true },
                  { key: "city",     label: "City" },
                  { key: "zip",      label: "ZIP" },
                ].map(({ key, label, span }) => (
                  <div key={key} className={span ? "col-span-2" : ""}>
                    <label className="block text-[10px] font-semibold text-charcoal/50 mb-1">{label}</label>
                    <input type="text" value={(form as Record<string, string>)[key]}
                      onChange={(e) => update(key, e.target.value)}
                      className="w-full border border-sand px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-dusty-rose bg-white"
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold text-charcoal/50 mb-1">Country</label>
                  <select value={form.country} onChange={(e) => update("country", e.target.value)}
                    className="w-full border border-sand px-3 py-2.5 rounded-xl text-sm bg-white focus:outline-none focus:border-dusty-rose">
                    <option value="" disabled>Select country…</option>
                    {[["LB","🇱🇧 Lebanon"],["US","🇺🇸 United States"],["QA","🇶🇦 Qatar"],["CY","🇨🇾 Cyprus"],["AE","🇦🇪 UAE"],["OTHER","🌍 Other"]].map(([v,l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2.5">Products *</p>
              <div className="space-y-2.5">
                {items.map((line, i) => {
                  const sel = products.find((p) => p.id === line.productId);
                  return (
                    <div key={i} className="border border-sand rounded-2xl p-3.5 space-y-2.5 bg-cream/40">
                      <div className="flex gap-2">
                        <select value={line.productId} onChange={(e) => updateLine(i, "productId", e.target.value)}
                          className="flex-1 border border-sand px-3 py-2 rounded-xl text-sm bg-white focus:outline-none focus:border-dusty-rose min-w-0">
                          <option value="">Select a product…</option>
                          {["t-shirts","hoodies","sweaters","matching-sets","kids","caps"].map((cat) => (
                            <optgroup key={cat} label={cat.replace(/-/g," ").replace(/\b\w/g, c => c.toUpperCase())}>
                              {products.filter((p) => p.category === cat).map((p) => (
                                <option key={p.id} value={p.id}>{p.name} — ${p.price}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        {items.length > 1 && (
                          <button onClick={() => removeLine(i)} className="p-2 hover:bg-red-50 rounded-xl transition-colors shrink-0">
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: "Size", content: (
                            <select value={line.size} disabled={!sel}
                              onChange={(e) => updateLine(i, "size", e.target.value)}
                              className="w-full border border-sand px-2 py-2 rounded-lg text-xs bg-white focus:outline-none focus:border-dusty-rose disabled:opacity-40">
                              {(sel?.sizes ?? []).map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          )},
                          { label: "Color", content: (
                            <select value={line.color} disabled={!sel}
                              onChange={(e) => updateLine(i, "color", e.target.value)}
                              className="w-full border border-sand px-2 py-2 rounded-lg text-xs bg-white focus:outline-none focus:border-dusty-rose disabled:opacity-40">
                              {(sel?.colors ?? []).map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                          )},
                          { label: "Qty", content: (
                            <input type="number" min={1} value={line.quantity}
                              onChange={(e) => updateLine(i, "quantity", Math.max(1, parseInt(e.target.value)||1))}
                              className="w-full border border-sand px-2 py-2 rounded-lg text-xs text-center focus:outline-none focus:border-dusty-rose" />
                          )},
                          { label: "$ / unit", content: (
                            <input type="number" min={0} step="0.5" value={line.unitPrice}
                              onChange={(e) => updateLine(i, "unitPrice", parseFloat(e.target.value)||0)}
                              className="w-full border border-sand px-2 py-2 rounded-lg text-xs text-center focus:outline-none focus:border-dusty-rose" />
                          )},
                        ].map(({ label, content }) => (
                          <div key={label}>
                            <p className="text-[9px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">{label}</p>
                            {content}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={addLine} className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-dusty-rose hover:text-soft-black transition-colors">
                <Plus size={13} /> Add another item
              </button>
            </div>

            {/* Payment + Status */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Payment Method", value: paymentMethod, onChange: (v: string) => setPay(v),
                  options: PAYMENT_OPTIONS },
                { label: "Initial Status", value: status, onChange: (v: string) => setStatus(v as OrderStatus),
                  options: STATUS_ORDER.map((s) => ({ value: s, label: STATUS_META[s].label })) },
              ].map(({ label, value, onChange, options }) => (
                <div key={label}>
                  <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1.5">{label}</p>
                  <select value={value} onChange={(e) => onChange(e.target.value)}
                    className="w-full border border-sand px-3 py-2.5 rounded-xl text-sm bg-white focus:outline-none focus:border-dusty-rose">
                    {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-cream rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Shipping</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-charcoal/60">$</span>
                  <input type="number" min={0} step="0.5" value={shipping}
                    onChange={(e) => setShipping(parseFloat(e.target.value)||0)}
                    className="w-16 border border-sand px-2 py-1 rounded-lg text-sm text-right focus:outline-none focus:border-dusty-rose bg-white" />
                </div>
              </div>
              <div className="border-t border-sand/60 pt-2 space-y-1 text-sm">
                <div className="flex justify-between text-charcoal/60"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-charcoal/60"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-soft-black border-t border-sand/60 pt-2 mt-1 text-base">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1.5">Note for customer</p>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                placeholder="e.g. Payment received via Whish. Will dispatch Tuesday."
                className="w-full border border-sand px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-dusty-rose resize-none placeholder:text-charcoal/30" />
            </div>
          </div>
        )}

        {/* Footer CTA */}
        {!created && (
          <div className="px-6 py-4 border-t border-sand bg-white shrink-0">
            <button onClick={submit} disabled={!canSubmit}
              className="w-full bg-soft-black text-white py-3.5 rounded-xl text-sm font-bold hover:bg-charcoal transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              Create Order · ${total.toFixed(2)}
            </button>
            {!canSubmit && (
              <p className="text-center text-[11px] text-charcoal/40 mt-2">Fill in customer name, phone, and all products</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Order Detail Panel ───────────────────────────────────────────────────────

function OrderDetailPanel({ order, onClose }: { order: StoredOrder; onClose: () => void }) {
  const { updateStatus, deleteOrder } = useOrderStore();
  const [newStatus, setNewStatus]     = useState<OrderStatus>(order.status);
  const [notes, setNotes]             = useState(order.notes ?? "");
  const [saved, setSaved]             = useState(false);
  const [confirmDelete, setConfirm]   = useState(false);

  const save = () => {
    updateStatus(order.id, newStatus, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleDelete = () => {
    deleteOrder(order.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-sand shrink-0">
          <button onClick={onClose} className="p-1.5 hover:bg-cream rounded-lg transition-colors">
            <ArrowLeft size={17} className="text-charcoal/60" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm font-bold text-soft-black truncate">{order.id}</p>
            <p className="text-[11px] text-charcoal/50">
              {new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <StatusPill status={order.status} />
          <button
            onClick={() => setConfirm(true)}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors ml-1"
            title="Delete order"
          >
            <Trash2 size={15} className="text-red-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-sand/60">
          {/* Customer */}
          <div className="p-5 space-y-3">
            <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest flex items-center gap-1.5">
              <User size={11} /> Customer
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name">{order.form.fullName}</Field>
              <Field label="Phone"><span className="flex items-center gap-1"><Phone size={11} className="text-dusty-rose" />{order.form.phone || "—"}</span></Field>
              {order.form.email && <Field label="Email" ><span className="flex items-center gap-1"><Mail size={11} className="text-dusty-rose" />{order.form.email}</span></Field>}
            </div>
          </div>

          {/* Address */}
          {order.form.address && (
            <div className="p-5">
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <MapPin size={11} /> Shipping Address
              </p>
              <p className="text-sm text-charcoal/70 leading-relaxed">
                {order.form.address}<br />
                {order.form.city}{order.form.zip ? ` ${order.form.zip}` : ""}, {order.form.country}
              </p>
            </div>
          )}

          {/* Items */}
          <div className="p-5">
            <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest flex items-center gap-1.5 mb-3">
              <ShoppingBag size={11} /> Items
            </p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-sm">
                  <div className="min-w-0 pr-3">
                    <p className="font-medium text-soft-black truncate">{item.product.name}</p>
                    <p className="text-xs text-charcoal/50">{item.size} · {item.color.name} × {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-soft-black shrink-0">
                    ${((item.overridePrice ?? item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-sand space-y-1 text-sm">
              <div className="flex justify-between text-charcoal/60"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-charcoal/60"><span>Shipping</span><span>${order.shippingCost.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-soft-black pt-1 border-t border-sand"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Payment */}
          <div className="p-5">
            <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <DollarSign size={11} /> Payment
            </p>
            <p className="text-sm text-charcoal/70 capitalize">
              {PAYMENT_OPTIONS.find((o) => o.value === order.paymentMethod)?.label ?? order.paymentMethod}
            </p>
          </div>

          {/* Note */}
          {order.notes && (
            <div className="p-5">
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <StickyNote size={11} /> Note
              </p>
              <p className="text-sm text-charcoal/70 italic">{order.notes}</p>
            </div>
          )}

          {/* Update Status */}
          <div className="p-5 space-y-3">
            <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Update Status</p>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_ORDER.map((s) => {
                const m = STATUS_META[s];
                return (
                  <button key={s} onClick={() => setNewStatus(s)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                      newStatus === s ? `${m.bg} ${m.text} border-current` : "border-sand text-charcoal/50 hover:border-charcoal/20"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${m.dot}`} /> {m.label}
                  </button>
                );
              })}
            </div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              placeholder="Leave a note visible to the customer…"
              className="w-full border border-sand px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-dusty-rose resize-none placeholder:text-charcoal/30" />
          </div>
        </div>

        {/* Delete confirmation bar */}
        {confirmDelete && (
          <div className="px-5 py-4 bg-red-50 border-t border-red-200 shrink-0">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Delete this order?</p>
                <p className="text-xs text-red-500 mt-0.5">This cannot be undone. The order will be permanently removed.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={13} /> Yes, Delete
              </button>
            </div>
          </div>
        )}

        {/* Save footer */}
        <div className="px-5 py-4 border-t border-sand bg-white shrink-0">
          <button onClick={save}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all ${
              saved ? "bg-emerald-500 text-white" : "bg-soft-black text-white hover:bg-charcoal"
            }`}
          >
            {saved ? <><Check size={15} /> Saved!</> : <><Edit3 size={15} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState(false);
  const [loading, setLoading]   = useState(false);

  const login = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    if (password === ADMIN_PASSWORD) { onAuth(); }
    else { setError(true); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-soft-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock size={22} className="text-white" />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-soft-black mb-1">Admin</h1>
          <p className="text-charcoal/50 text-sm">HealingMakers Order Management</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand/60">
          <label className="block text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1.5">Password</label>
          <input type="password" value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Enter password"
            className={`w-full border px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors mb-3 ${
              error ? "border-red-300 bg-red-50" : "border-sand focus:border-dusty-rose"
            }`}
          />
          {error && <p className="text-red-500 text-xs mb-3 flex items-center gap-1"><X size={11} /> Incorrect password</p>}
          <button onClick={login} disabled={loading || !password}
            className="w-full bg-soft-black text-white py-3 rounded-xl text-sm font-bold hover:bg-charcoal transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
            {loading ? <Loader2 size={15} className="animate-spin" /> : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const { orders } = useOrderStore();
  const { reviews, updateStatus: updateReviewStatus, deleteReview } = useReviewStore();
  const [mounted, setMounted]         = useState(false);
  const [authed, setAuthed]           = useState(false);
  const [tab, setTab]                 = useState<"orders" | "reviews">("orders");
  const [search, setSearch]           = useState("");
  const [statusFilter, setFilter]     = useState<OrderStatus | "all">("all");
  const [showCreate, setShowCreate]   = useState(false);
  const [selected, setSelected]       = useState<StoredOrder | null>(null);

  useEffect(() => { setMounted(true); }, []);

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 size={26} className="animate-spin text-dusty-rose" />
      </div>
    );
  }

  const filtered = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.form.fullName.toLowerCase().includes(q) || o.form.phone.includes(q);
    return matchSearch && (statusFilter === "all" || o.status === statusFilter);
  });

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const counts  = STATUS_ORDER.reduce((a, s) => ({ ...a, [s]: orders.filter((o) => o.status === s).length }), {} as Record<string, number>);

  const STATS = [
    { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "text-soft-black", bg: "bg-soft-black/5" },
    { label: "Pending",      value: counts.pending,    icon: Clock,         color: "text-amber-600",  bg: "bg-amber-50" },
    { label: "Processing",   value: counts.processing, icon: Package,       color: "text-blue-600",   bg: "bg-blue-50" },
    { label: "Shipped",      value: counts.shipped,    icon: Truck,         color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Delivered",    value: counts.delivered,  icon: CheckCircle2,  color: "text-emerald-600",bg: "bg-emerald-50" },
    { label: "Revenue",      value: `$${revenue.toFixed(0)}`, icon: DollarSign,   color: "text-dusty-rose", bg: "bg-dusty-rose/10" },
  ];

  return (
    <>
      {showCreate && <CreateOrderModal onClose={() => setShowCreate(false)} />}
      {selected   && <OrderDetailPanel order={selected} onClose={() => setSelected(null)} />}

      <div className="min-h-screen bg-[#f8f6f3]">
        {/* Top Nav */}
        <header className="bg-white border-b border-sand sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-soft-black rounded-lg flex items-center justify-center">
                <Package size={13} className="text-white" />
              </div>
              <span className="font-playfair font-bold text-soft-black text-base hidden sm:block">HealingMakers</span>
              <span className="text-charcoal/30 hidden sm:block">·</span>
              <span className="text-sm text-charcoal/60 hidden sm:block">Admin</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Tab switcher */}
              <div className="hidden sm:flex items-center bg-cream rounded-xl p-1 gap-0.5 border border-sand">
                <button onClick={() => setTab("orders")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${tab === "orders" ? "bg-white text-soft-black shadow-sm" : "text-charcoal/50 hover:text-charcoal"}`}>
                  <Package size={12} /> Orders
                  <span className="ml-1 opacity-60">{orders.length}</span>
                </button>
                <button onClick={() => setTab("reviews")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${tab === "reviews" ? "bg-white text-soft-black shadow-sm" : "text-charcoal/50 hover:text-charcoal"}`}>
                  <Star size={12} /> Reviews
                  {reviews.filter(r => r.status === "pending").length > 0 && (
                    <span className="ml-1 bg-dusty-rose text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {reviews.filter(r => r.status === "pending").length}
                    </span>
                  )}
                </button>
              </div>
              {tab === "orders" && (
                <button onClick={() => setShowCreate(true)}
                  className="flex items-center gap-1.5 bg-dusty-rose text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-dusty-rose/90 transition-colors shadow-sm">
                  <Plus size={14} /> <span className="hidden sm:inline">Create Order</span><span className="sm:hidden">New</span>
                </button>
              )}
              <button onClick={() => setAuthed(false)}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-charcoal/50 hover:text-dusty-rose transition-colors px-2 py-2">
                <LogOut size={14} /> <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Mobile tab switcher */}
          <div className="flex sm:hidden items-center bg-white rounded-xl p-1 gap-0.5 border border-sand">
            <button onClick={() => setTab("orders")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${tab === "orders" ? "bg-soft-black text-white shadow-sm" : "text-charcoal/50"}`}>
              <Package size={12} /> Orders <span className="opacity-60">{orders.length}</span>
            </button>
            <button onClick={() => setTab("reviews")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${tab === "reviews" ? "bg-soft-black text-white shadow-sm" : "text-charcoal/50"}`}>
              <Star size={12} /> Reviews
              {reviews.filter(r => r.status === "pending").length > 0 && (
                <span className="ml-0.5 bg-dusty-rose text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {reviews.filter(r => r.status === "pending").length}
                </span>
              )}
            </button>
          </div>

          {tab === "reviews" ? (
            <ReviewsPanel reviews={reviews} updateStatus={updateReviewStatus} deleteReview={deleteReview} />
          ) : (<>

          {/* Stats */}
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {STATS.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl p-4 border border-sand/60 shadow-sm">
                <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={15} className={color} />
                </div>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-[11px] text-charcoal/50 mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-sand/60 shadow-sm p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, order ID or phone…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sand text-sm focus:outline-none focus:border-dusty-rose bg-cream/40" />
              </div>
              {/* Status filter tabs */}
              <div className="flex gap-1.5 flex-wrap">
                {[{ value: "all", label: "All" }, ...STATUS_ORDER.map((s) => ({ value: s, label: STATUS_META[s].label }))].map(({ value, label }) => (
                  <button key={value} onClick={() => setFilter(value as OrderStatus | "all")}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      statusFilter === value
                        ? "bg-soft-black text-white shadow-sm"
                        : "text-charcoal/60 hover:bg-cream"
                    }`}
                  >
                    {label}
                    {value !== "all" && <span className="ml-1.5 opacity-70">{counts[value] ?? 0}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Orders */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-sand/60 shadow-sm py-20 text-center">
              <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package size={24} className="text-charcoal/30" />
              </div>
              <p className="font-semibold text-soft-black mb-1">
                {orders.length === 0 ? "No orders yet" : "Nothing matches your search"}
              </p>
              <p className="text-sm text-charcoal/50 mb-5">
                {orders.length === 0 ? "Orders from checkout appear here automatically." : "Try a different filter or search term."}
              </p>
              {orders.length === 0 && (
                <button onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-2 bg-dusty-rose text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-dusty-rose/90 transition-colors">
                  <Plus size={14} /> Create your first order
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-sand/60 shadow-sm overflow-hidden">
              {/* Table header — desktop only */}
              <div className="hidden lg:grid grid-cols-[1fr_1fr_80px_80px_120px_100px_44px] gap-4 px-5 py-3 border-b border-sand bg-cream/50">
                {["Order ID","Customer","Items","Total","Status","Date",""].map((h) => (
                  <span key={h} className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">{h}</span>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-sand/60">
                {filtered.map((order) => (
                  <button key={order.id} onClick={() => setSelected(order)}
                    className="w-full text-left hover:bg-cream/40 transition-colors group">
                    {/* Desktop row */}
                    <div className="hidden lg:grid grid-cols-[1fr_1fr_80px_80px_120px_100px_44px] gap-4 items-center px-5 py-4">
                      <span className="font-mono text-xs font-bold text-soft-black truncate">{order.id}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-soft-black truncate">{order.form.fullName}</p>
                        <p className="text-xs text-charcoal/50 truncate">{order.form.phone}</p>
                      </div>
                      <span className="text-sm text-charcoal/70">{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                      <span className="text-sm font-semibold text-soft-black">${order.total.toFixed(2)}</span>
                      <StatusPill status={order.status} />
                      <span className="text-xs text-charcoal/50">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <ChevronRight size={14} className="text-charcoal/30 group-hover:text-dusty-rose transition-colors" />
                    </div>

                    {/* Mobile card */}
                    <div className="lg:hidden p-4 flex items-start gap-3">
                      <div className="w-9 h-9 bg-cream rounded-xl flex items-center justify-center shrink-0">
                        <Package size={15} className="text-dusty-rose" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-mono text-xs font-bold text-soft-black truncate">{order.id}</p>
                          <StatusPill status={order.status} />
                        </div>
                        <p className="text-sm font-medium text-soft-black">{order.form.fullName}</p>
                        <p className="text-xs text-charcoal/50 mt-0.5">
                          {order.items.length} item{order.items.length > 1 ? "s" : ""} · ${order.total.toFixed(2)} ·{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-charcoal/30 shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer count */}
              <div className="px-5 py-3 border-t border-sand bg-cream/30">
                <p className="text-xs text-charcoal/50">
                  Showing {filtered.length} of {orders.length} order{orders.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}
          </>)}
        </div>
      </div>
    </>
  );
}

// ─── Reviews Panel ────────────────────────────────────────────────────────────

const REVIEW_STATUS_META = {
  pending:  { label: "Pending",  bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400" },
  approved: { label: "Approved", bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-500" },
  rejected: { label: "Rejected", bg: "bg-red-50",      text: "text-red-600",     dot: "bg-red-400" },
};

function ReviewsPanel({
  reviews,
  updateStatus,
  deleteReview,
}: {
  reviews: SubmittedReview[];
  updateStatus: (id: string, status: SubmittedReview["status"]) => void;
  deleteReview: (id: string) => void;
}) {
  const [filter, setFilter] = useState<SubmittedReview["status"] | "all">("all");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const visible = reviews.filter((r) => filter === "all" || r.status === filter);
  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-4">
      {/* Header + filter */}
      <div className="bg-white rounded-2xl border border-sand/60 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <p className="font-semibold text-soft-black text-sm">{reviews.length} review{reviews.length !== 1 ? "s" : ""} submitted</p>
          {pendingCount > 0 && <p className="text-xs text-amber-600 mt-0.5">{pendingCount} awaiting approval</p>}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "pending", "approved", "rejected"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === s ? "bg-soft-black text-white" : "text-charcoal/50 hover:bg-cream"
              }`}>
              {s} {s !== "all" && <span className="ml-1 opacity-60">{reviews.filter(r => r.status === s).length}</span>}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-sand/60 shadow-sm py-20 text-center">
          <MessageSquare size={28} className="text-charcoal/20 mx-auto mb-3" />
          <p className="font-semibold text-soft-black mb-1">No reviews here</p>
          <p className="text-sm text-charcoal/50">Submitted reviews from /reviews will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => {
            const meta = REVIEW_STATUS_META[r.status];
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-sand/60 shadow-sm p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <span className="font-semibold text-soft-black text-sm">{r.name}</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${meta.bg} ${meta.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />{meta.label}
                      </span>
                      <span className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} className={i < r.rating ? "text-amber-400 fill-amber-400" : "text-sand fill-sand"} />
                        ))}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-charcoal/50 mb-2.5">
                      {r.product && <span>📦 {r.product}</span>}
                      {r.instagram && <span>📸 {r.instagram}</span>}
                      <span>🕐 {new Date(r.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>

                    {/* Text */}
                    <p className="text-sm text-charcoal/70 leading-relaxed italic">&ldquo;{r.text}&rdquo;</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-sand/60">
                  {r.status !== "approved" && (
                    <button onClick={() => updateStatus(r.id, "approved")}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors">
                      <ThumbsUp size={12} /> Approve
                    </button>
                  )}
                  {r.status !== "rejected" && (
                    <button onClick={() => updateStatus(r.id, "rejected")}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors">
                      <ThumbsDown size={12} /> Reject
                    </button>
                  )}
                  {r.status === "pending" && (
                    <button onClick={() => updateStatus(r.id, "pending")}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-cream text-charcoal/60 rounded-xl text-xs font-semibold hover:bg-sand transition-colors">
                      Reset
                    </button>
                  )}
                  <div className="flex-1" />
                  {confirmId === r.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-500 font-medium">Delete?</span>
                      <button onClick={() => { deleteReview(r.id); setConfirmId(null); }}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors">Yes</button>
                      <button onClick={() => setConfirmId(null)}
                        className="px-3 py-1.5 bg-cream rounded-lg text-xs font-semibold text-charcoal/60 hover:bg-sand transition-colors">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmId(r.id)}
                      className="p-2 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 size={13} className="text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
