import { useState, useEffect } from "react";

const API = "https://dropradar-backend-production.up.railway.app";

const PRODUCTS_INIT = [
  { id: 1, name: "Magnetic Phone Mount", supplier: "CJdropshipping", cost: 2.4, price: 18.99, stock: 142, status: "active", category: "Auto", trend: "+34%", sales: 47, monitored: true, emoji: "📱" },
  { id: 2, name: "LED Desk Lamp + Wireless Charger", supplier: "AliExpress", cost: 8.5, price: 39.99, stock: 88, status: "active", category: "Electronics", trend: "+61%", sales: 31, monitored: true, emoji: "💡", priceAlert: true },
  { id: 3, name: "Posture Corrector Brace", supplier: "Zendrop", cost: 3.1, price: 24.99, stock: 0, status: "out_of_stock", category: "Health", trend: "+18%", sales: 19, monitored: false, emoji: "🦺" },
  { id: 4, name: "Reusable Silicone Food Bags", supplier: "CJdropshipping", cost: 1.8, price: 15.99, stock: 210, status: "active", category: "Kitchen", trend: "+45%", sales: 63, monitored: true, emoji: "🛍️" },
  { id: 5, name: "Smart Pet Water Fountain", supplier: "TeemDrop", cost: 11.0, price: 44.99, stock: 34, status: "active", category: "Pets", trend: "+52%", sales: 22, monitored: true, emoji: "🐾" },
  { id: 6, name: "Foldable Laptop Stand", supplier: "AliExpress", cost: 4.0, price: 27.99, stock: 5, status: "low_stock", category: "Electronics", trend: "+55%", sales: 58, monitored: true, emoji: "💻" },
];

const ORDERS_INIT = [
  { id: "WC-1041", product: "Magnetic Phone Mount", customer: "James O.", date: "Mar 8", status: "fulfilled", profit: 12.4, supplier: "CJdropshipping", tracking: "CJ882910XA" },
  { id: "WC-1040", product: "LED Desk Lamp", customer: "Amaka N.", date: "Mar 8", status: "processing", profit: 24.2, supplier: "AliExpress", tracking: "" },
  { id: "WC-1039", product: "Silicone Food Bags", customer: "Tunde B.", date: "Mar 7", status: "fulfilled", profit: 9.8, supplier: "CJdropshipping", tracking: "CJ771234AB" },
  { id: "WC-1038", product: "Smart Pet Fountain", customer: "Chidi E.", date: "Mar 7", status: "fulfilled", profit: 28.6, supplier: "TeemDrop", tracking: "TD990021ZZ" },
  { id: "WC-1037", product: "Foldable Laptop Stand", customer: "Grace A.", date: "Mar 6", status: "awaiting", profit: 18.5, supplier: "AliExpress", tracking: "" },
  { id: "WC-1036", product: "Magnetic Phone Mount", customer: "Emeka R.", date: "Mar 6", status: "fulfilled", profit: 12.4, supplier: "CJdropshipping", tracking: "CJ771100CC" },
  { id: "WC-1035", product: "Posture Corrector", customer: "Bola F.", date: "Mar 5", status: "cancelled", profit: 0, supplier: "Zendrop", tracking: "" },
];

const CATALOG = [
  { id: 101, name: "Portable Mini Blender", supplier: "CJdropshipping", cost: 6.0, price: 34.99, trend: "+38%", rating: 4.6, orders: 1420, emoji: "🥤", category: "Kitchen" },
  { id: 102, name: "Knee Compression Sleeve", supplier: "AliExpress", cost: 2.2, price: 19.99, trend: "+22%", rating: 4.5, orders: 3800, emoji: "🦵", category: "Health" },
  { id: 103, name: "Minimalist Leather Wallet", supplier: "TeemDrop", cost: 3.5, price: 29.99, trend: "+41%", rating: 4.7, orders: 960, emoji: "👛", category: "Fashion" },
  { id: 104, name: "Car Seat Gap Organizer", supplier: "Zendrop", cost: 1.5, price: 14.99, trend: "+29%", rating: 4.4, orders: 2100, emoji: "🚗", category: "Auto" },
  { id: 105, name: "Bamboo Toothbrush Set", supplier: "CJdropshipping", cost: 2.0, price: 16.99, trend: "+67%", rating: 4.8, orders: 5300, emoji: "🌿", category: "Eco" },
  { id: 106, name: "Electric Nail File Kit", supplier: "AliExpress", cost: 4.5, price: 26.99, trend: "+49%", rating: 4.3, orders: 780, emoji: "💅", category: "Beauty" },
  { id: 107, name: "Dog Seat Belt Harness", supplier: "TeemDrop", cost: 3.2, price: 22.99, trend: "+55%", rating: 4.6, orders: 1670, emoji: "🐕", category: "Pets" },
  { id: 108, name: "Silicone Stretch Lids Set", supplier: "CJdropshipping", cost: 1.9, price: 13.99, trend: "+33%", rating: 4.5, orders: 4200, emoji: "🍲", category: "Kitchen" },
];

const RULES_INIT = [
  { id: 1, name: "Auto Price Update", desc: "Adjust sell price when supplier cost changes by more than 5%", trigger: "Price Change", action: "Update Price", active: true },
  { id: 2, name: "Out of Stock Alert", desc: "Pause listing when stock hits 0 and send alert", trigger: "Stock = 0", action: "Pause + Alert", active: true },
  { id: 3, name: "Low Stock Warning", desc: "Send alert when stock falls below 10 units", trigger: "Stock less than 10", action: "Send Alert", active: false },
  { id: 4, name: "Auto Order Fulfillment", desc: "Auto-place supplier order when a new WooCommerce order arrives", trigger: "New Order", action: "Place Order", active: true },
  { id: 5, name: "Tracking Sync", desc: "Push tracking number back to WooCommerce when ready", trigger: "Tracking Ready", action: "Sync to WC", active: true },
];

const SUPPLIERS_LIST = [
  { name: "CJdropshipping", emoji: "📦", connected: true, products: 3, orders: 89, url: "https://cjdropshipping.com", plugin: "https://cjdropshipping.com/woocommerce-dropshipping.html" },
  { name: "AliExpress", emoji: "🛒", connected: true, products: 2, orders: 44, url: "https://aliexpress.com", plugin: "https://alidropship.com" },
  { name: "TeemDrop", emoji: "🤖", connected: true, products: 2, orders: 22, url: "https://teemdrop.com", plugin: "https://teemdrop.com" },
  { name: "Zendrop", emoji: "⚡", connected: false, products: 0, orders: 0, url: "https://zendrop.com", plugin: "https://zendrop.com/integrations/woocommerce" },
  { name: "Spocket", emoji: "🚀", connected: false, products: 0, orders: 0, url: "https://spocket.co", plugin: "https://wordpress.org/plugins/spocket" },
];

const NAV = [
  { id: "dashboard",  label: "Dashboard",       icon: "🏠" },
  { id: "products",   label: "My Products",      icon: "📦" },
  { id: "import",     label: "Import Products",  icon: "⬇️" },
  { id: "orders",     label: "Orders",           icon: "🧾" },
  { id: "monitor",    label: "Price Monitor",    icon: "📡" },
  { id: "automate",   label: "Automation",       icon: "⚙️" },
  { id: "suppliers",  label: "Suppliers",        icon: "🔗" },
  { id: "calculator", label: "Profit Calc",      icon: "💰" },
];

const STATUS_MAP = {
  active:       { bg: "#052e16", color: "#4ade80", border: "#16a34a", label: "Active" },
  low_stock:    { bg: "#431407", color: "#fbbf24", border: "#d97706", label: "Low Stock" },
  out_of_stock: { bg: "#2b0d0d", color: "#f87171", border: "#dc2626", label: "Out of Stock" },
  fulfilled:    { bg: "#052e16", color: "#4ade80", border: "#16a34a", label: "Fulfilled" },
  processing:   { bg: "#1e1b4b", color: "#a5b4fc", border: "#6366f1", label: "Processing" },
  awaiting:     { bg: "#431407", color: "#fbbf24", border: "#d97706", label: "Awaiting Supplier" },
  cancelled:    { bg: "#1c0a0a", color: "#f87171", border: "#7f1d1d", label: "Cancelled" },
};

function Badge({ s }) {
  const st = STATUS_MAP[s] || STATUS_MAP.active;
  return (
    <span style={{ background: st.bg, color: st.color, border: "1px solid " + st.border, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      {st.label}
    </span>
  );
}

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 12, padding: "18px 20px" }}>
      <div style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, fontFamily: "monospace" }}>{label}</div>
      <div style={{ color: color || "#e2e8f0", fontSize: 28, fontWeight: 700, fontFamily: "monospace" }}>{value}</div>
      {sub && <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState(PRODUCTS_INIT);
  const [orders, setOrders] = useState(ORDERS_INIT);
  const [rules, setRules] = useState(RULES_INIT);
  const [toast, setToast] = useState(null);
  const [importSearch, setImportSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState("connecting");

  useEffect(() => {
    async function loadData() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch(API + "/api/orders"),
          fetch(API + "/api/products")
        ]);
        const realOrders = await ordersRes.json();
        const realProducts = await productsRes.json();
        if (Array.isArray(realOrders) && realOrders.length > 0) setOrders(realOrders);
        if (Array.isArray(realProducts) && realProducts.length > 0) setProducts(realProducts);
        setBackendStatus("connected");
      } catch(err) {
        console.log("Using demo data:", err.message);
        setBackendStatus("demo");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function notify(msg, ok) {
    setToast({ msg, ok: ok !== false });
    setTimeout(() => setToast(null), 3000);
  }

  const totalProfit = orders.filter(o => o.status === "fulfilled").reduce((a, o) => a + o.profit, 0);
  const pending = orders.filter(o => o.status === "processing" || o.status === "awaiting").length;

  const containerStyle = { display: "flex", minHeight: "100vh", background: "#0a0f1a", color: "#e2e8f0", fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14 };
  const sidebarStyle = { width: collapsed ? 60 : 210, background: "#0d1424", borderRight: "1px solid #1e2d45", display: "flex", flexDirection: "column", flexShrink: 0, transition: "width 0.25s", overflow: "hidden" };
  const mainStyle = { flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minWidth: 0 };
  const contentStyle = { padding: 24, flex: 1 };

  // Loading screen
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 48, height: 48, background: "linear-gradient(135deg,#3b82f6,#6366f1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>⚡</div>
        <div style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 600 }}>DropRadar Pro</div>
        <div style={{ color: "#64748b", fontSize: 13 }}>Connecting to your WooCommerce store...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.ok ? "#052e16" : "#2b0d0d", border: "1px solid " + (toast.ok ? "#16a34a" : "#dc2626"), color: toast.ok ? "#4ade80" : "#f87171", borderRadius: 10, padding: "12px 20px", fontSize: 13, fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          {toast.ok ? "✅" : "⚠️"} {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ padding: "18px 14px", borderBottom: "1px solid #1e2d45", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#3b82f6,#6366f1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, color: "#fff" }}>⚡</div>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>DropRadar</div>
              <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>WooCommerce</div>
            </div>
          )}
        </div>
        <nav style={{ flex: 1, padding: "10px 8px" }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, border: "none", background: page === n.id ? "rgba(59,130,246,0.12)" : "transparent", color: page === n.id ? "#3b82f6" : "#64748b", fontWeight: page === n.id ? 600 : 400, fontSize: 13, textAlign: "left", marginBottom: 2, cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
              {!collapsed && n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "10px 8px", borderTop: "1px solid #1e2d45" }}>
          <button onClick={() => setCollapsed(v => !v)} style={{ width: "100%", padding: 8, borderRadius: 8, border: "none", background: "transparent", color: "#64748b", fontSize: 16, cursor: "pointer" }}>
            {collapsed ? "▶" : "◀"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={mainStyle}>
        {/* Topbar */}
        <div style={{ background: "#0d1424", borderBottom: "1px solid #1e2d45", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>{NAV.find(n => n.id === page)?.label}</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>WooCommerce · dropradar.mystore.com</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: backendStatus === "connected" ? "#052e16" : backendStatus === "demo" ? "#431407" : "#1e1b4b", border: "1px solid " + (backendStatus === "connected" ? "#16a34a" : backendStatus === "demo" ? "#d97706" : "#6366f1"), borderRadius: 20, padding: "4px 12px", color: backendStatus === "connected" ? "#4ade80" : backendStatus === "demo" ? "#fbbf24" : "#a5b4fc", fontSize: 12 }}>
              {backendStatus === "connected" ? "● Live Store Connected" : backendStatus === "demo" ? "⚠️ Demo Mode" : "○ Connecting..."}
            </div>
            <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff" }}>U</div>
          </div>
        </div>

        <div style={contentStyle}>

          {/* DASHBOARD */}
          {page === "dashboard" && (
            <div>
              {backendStatus === "demo" && (
                <div style={{ background: "#431407", border: "1px solid #d97706", borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#fbbf24", fontSize: 13 }}>⚠️ Showing demo data. Sync your real WooCommerce store to see live data.</span>
                  <button onClick={async () => {
                    notify("Syncing your store...");
                    try {
                      await fetch(API + "/api/sync-orders");
                      await fetch(API + "/api/sync-products");
                      const [o, p] = await Promise.all([
                        fetch(API + "/api/orders").then(r => r.json()),
                        fetch(API + "/api/products").then(r => r.json())
                      ]);
                      if (Array.isArray(o) && o.length > 0) setOrders(o);
                      if (Array.isArray(p) && p.length > 0) setProducts(p);
                      setBackendStatus("connected");
                      notify("Store synced successfully!");
                    } catch(e) { notify("Sync failed - check Railway is running", false); }
                  }} style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", marginLeft: 16 }}>
                    🔄 Sync Now
                  </button>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                <StatCard label="Total Profit" value={"$" + totalProfit.toFixed(0)} color="#10b981" sub="Fulfilled orders" />
                <StatCard label="Total Orders" value={orders.length} sub={pending + " pending"} />
                <StatCard label="Active Products" value={products.filter(p => p.status === "active").length} color="#3b82f6" sub={products.length + " total"} />
                <StatCard label="Avg Margin" value="58%" color="#f59e0b" sub="Across store" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
                <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 14, padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>Recent Orders</span>
                    <button onClick={() => setPage("orders")} style={{ background: "none", border: "none", color: "#3b82f6", fontSize: 12, cursor: "pointer" }}>View all →</button>
                  </div>
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1e2d45" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{o.product}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>#{o.id} · {o.customer} · {o.date}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {o.profit > 0 && <span style={{ color: "#10b981", fontSize: 13, fontFamily: "monospace" }}>+${o.profit.toFixed(2)}</span>}
                        <Badge s={o.status} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 14, padding: 20 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>🔔 Alerts</div>
                    {[
                      { color: "#f59e0b", msg: "Laptop Stand — only 5 left in stock" },
                      { color: "#f87171", msg: "Posture Corrector — out of stock, paused" },
                      { color: "#3b82f6", msg: "LED Lamp supplier price changed (+$1.20)" },
                      { color: "#a5b4fc", msg: "2 orders awaiting fulfillment" },
                    ].map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, padding: "8px 0", borderBottom: i < 3 ? "1px solid #1e2d45" : "none" }}>
                        <span style={{ color: a.color, fontSize: 12, lineHeight: 1.5 }}>⚡ {a.msg}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 14, padding: 20 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>⚙️ Automation</div>
                    {rules.filter(r => r.active).map(r => (
                      <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                        <span style={{ color: "#64748b", fontSize: 12 }}>{r.name}</span>
                        <span style={{ color: "#10b981", fontSize: 11 }}>● ON</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MY PRODUCTS */}
          {page === "products" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ color: "#64748b", fontSize: 13 }}>{products.length} products in store</span>
                <button onClick={() => setPage("import")} style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none", borderRadius: 8, padding: "9px 18px", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  + Import Products
                </button>
              </div>
              <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 14, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1e2d45" }}>
                      {["Product", "Supplier", "Cost", "Sell Price", "Profit", "Stock", "Sales", "Status", ""].map(h => (
                        <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "#64748b", fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", whiteSpace: "nowrap", fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => {
                      const profit = (p.price - p.cost - 3).toFixed(2);
                      const margin = (((p.price - p.cost - 3) / p.price) * 100).toFixed(0);
                      return (
                        <tr key={p.id} style={{ borderBottom: "1px solid #1e2d45" }}>
                          <td style={{ padding: "13px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 22 }}>{p.emoji}</span>
                              <div>
                                <div style={{ fontWeight: 500, fontSize: 13 }}>{p.name}</div>
                                <div style={{ color: "#64748b", fontSize: 11 }}>{p.category} · {p.trend}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "13px 14px", color: "#64748b", fontSize: 12 }}>{p.supplier}</td>
                          <td style={{ padding: "13px 14px", fontFamily: "monospace", fontSize: 13 }}>${p.cost.toFixed(2)}</td>
                          <td style={{ padding: "13px 14px", fontFamily: "monospace", fontSize: 13 }}>${p.price.toFixed(2)}</td>
                          <td style={{ padding: "13px 14px" }}>
                            <div style={{ color: "#10b981", fontFamily: "monospace", fontSize: 13 }}>${profit}</div>
                            <div style={{ color: "#64748b", fontSize: 10 }}>{margin}%</div>
                          </td>
                          <td style={{ padding: "13px 14px", fontFamily: "monospace", fontSize: 13, color: p.stock < 10 ? "#f59e0b" : "#e2e8f0" }}>{p.stock}</td>
                          <td style={{ padding: "13px 14px", fontFamily: "monospace", fontSize: 13 }}>{p.sales}</td>
                          <td style={{ padding: "13px 14px" }}><Badge s={p.status} /></td>
                          <td style={{ padding: "13px 14px" }}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button onClick={() => { setProducts(prev => prev.map(x => x.id === p.id ? { ...x, monitored: !x.monitored } : x)); notify(p.monitored ? "Monitoring off" : "Monitoring on"); }}
                                style={{ background: p.monitored ? "rgba(59,130,246,0.15)" : "transparent", border: "1px solid " + (p.monitored ? "#3b82f6" : "#1e2d45"), borderRadius: 6, padding: "4px 8px", color: p.monitored ? "#3b82f6" : "#64748b", fontSize: 12, cursor: "pointer" }}>📡</button>
                              <button onClick={() => { setProducts(prev => prev.filter(x => x.id !== p.id)); notify(p.name + " removed"); }}
                                style={{ background: "transparent", border: "1px solid #1e2d45", borderRadius: 6, padding: "4px 8px", color: "#f87171", fontSize: 12, cursor: "pointer" }}>🗑</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* IMPORT */}
          {page === "import" && (
            <div>
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>Browse supplier catalogs and import directly to your WooCommerce store.</p>
              <input placeholder="Search products to import..." value={importSearch} onChange={e => setImportSearch(e.target.value)}
                style={{ width: "100%", background: "#111827", border: "1px solid #1e2d45", borderRadius: 10, padding: "11px 16px", color: "#e2e8f0", fontSize: 14, outline: "none", marginBottom: 20, boxSizing: "border-box" }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {CATALOG.filter(p => p.name.toLowerCase().includes(importSearch.toLowerCase())).map(p => {
                  const alreadyAdded = products.some(x => x.name === p.name);
                  const profit = (p.price - p.cost - 3).toFixed(2);
                  const margin = (((p.price - p.cost - 3) / p.price) * 100).toFixed(0);
                  return (
                    <div key={p.id} style={{ background: "#111827", border: "1px solid " + (alreadyAdded ? "#16a34a" : "#1e2d45"), borderRadius: 14, padding: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <span style={{ fontSize: 26 }}>{p.emoji}</span>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                            <div style={{ color: "#64748b", fontSize: 11 }}>{p.supplier} · {p.category}</div>
                          </div>
                        </div>
                        <span style={{ background: "#052e16", border: "1px solid #16a34a", borderRadius: 12, padding: "2px 8px", color: "#4ade80", fontSize: 11, whiteSpace: "nowrap" }}>{p.trend}</span>
                      </div>
                      {[["Supplier Cost", "$" + p.cost], ["Suggested Price", "$" + p.price], ["Est. Profit", "$" + profit + " (" + margin + "%)"], ["Monthly Orders", p.orders.toLocaleString()]].map(([l, v]) => (
                        <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #1e2d45" }}>
                          <span style={{ color: "#64748b", fontSize: 11 }}>{l}</span>
                          <span style={{ fontFamily: "monospace", fontSize: 12 }}>{v}</span>
                        </div>
                      ))}
                      <button disabled={alreadyAdded}
                        onClick={() => {
                          setProducts(prev => [...prev, { id: Date.now(), name: p.name, supplier: p.supplier, cost: p.cost, price: p.price, stock: 99, status: "active", category: p.category, trend: p.trend, sales: 0, monitored: true, emoji: p.emoji }]);
                          notify(p.name + " imported to store!");
                        }}
                        style={{ marginTop: 12, width: "100%", background: alreadyAdded ? "#052e16" : "linear-gradient(135deg,#3b82f6,#6366f1)", border: "1px solid " + (alreadyAdded ? "#16a34a" : "transparent"), borderRadius: 8, padding: 9, color: alreadyAdded ? "#4ade80" : "#fff", fontWeight: 600, fontSize: 13, cursor: alreadyAdded ? "default" : "pointer" }}>
                        {alreadyAdded ? "✅ Already in Store" : "⬇️ Import to WooCommerce"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ORDERS */}
          {page === "orders" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
                <StatCard label="Total Orders" value={orders.length} />
                <StatCard label="Fulfilled" value={orders.filter(o => o.status === "fulfilled").length} color="#10b981" />
                <StatCard label="Pending" value={pending} color="#f59e0b" />
                <StatCard label="Total Profit" value={"$" + orders.reduce((a,o)=>a+o.profit,0).toFixed(0)} color="#10b981" />
              </div>
              <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 14, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1e2d45" }}>
                      {["Order", "Product", "Customer", "Date", "Supplier", "Tracking", "Profit", "Status", "Action"].map(h => (
                        <th key={h} style={{ padding: "11px 14px", textAlign: "left", color: "#64748b", fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", whiteSpace: "nowrap", fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} style={{ borderBottom: "1px solid #1e2d45" }}>
                        <td style={{ padding: "11px 14px", fontFamily: "monospace", color: "#3b82f6", fontSize: 13 }}>#{o.id}</td>
                        <td style={{ padding: "11px 14px", fontSize: 13 }}>{o.product}</td>
                        <td style={{ padding: "11px 14px", color: "#64748b", fontSize: 12 }}>{o.customer}</td>
                        <td style={{ padding: "11px 14px", color: "#64748b", fontSize: 12 }}>{o.date}</td>
                        <td style={{ padding: "11px 14px", color: "#64748b", fontSize: 12 }}>{o.supplier}</td>
                        <td style={{ padding: "11px 14px", fontFamily: "monospace", fontSize: 11, color: o.tracking ? "#10b981" : "#64748b" }}>{o.tracking || "—"}</td>
                        <td style={{ padding: "11px 14px", fontFamily: "monospace", color: o.profit > 0 ? "#10b981" : "#64748b", fontSize: 13 }}>{o.profit > 0 ? "+$" + o.profit.toFixed(2) : "—"}</td>
                        <td style={{ padding: "11px 14px" }}><Badge s={o.status} /></td>
                        <td style={{ padding: "11px 14px" }}>
                          {o.status === "processing" && (
                            <button onClick={() => { setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: "awaiting" } : x)); notify("Order #" + o.id + " sent to supplier"); }}
                              style={{ background: "rgba(59,130,246,0.15)", border: "1px solid #3b82f6", borderRadius: 6, padding: "4px 10px", color: "#3b82f6", fontSize: 11, cursor: "pointer" }}>
                              Fulfill →
                            </button>
                          )}
                          {o.status === "awaiting" && (
                            <button onClick={() => { setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: "fulfilled", tracking: "TRK" + Math.floor(Math.random()*999999) } : x)); notify("Order #" + o.id + " fulfilled!"); }}
                              style={{ background: "#052e16", border: "1px solid #16a34a", borderRadius: 6, padding: "4px 10px", color: "#4ade80", fontSize: 11, cursor: "pointer" }}>
                              Mark Done
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRICE MONITOR */}
          {page === "monitor" && (
            <div>
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>DropRadar watches supplier prices 24/7. Sync changes to WooCommerce with one click.</p>
              <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 14, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1e2d45" }}>
                      {["Product", "Supplier", "Supplier Cost", "Your Price", "Margin", "Monitor", "Status"].map(h => (
                        <th key={h} style={{ padding: "11px 14px", textAlign: "left", color: "#64748b", fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => {
                      const margin = (((p.price - p.cost - 3) / p.price) * 100).toFixed(0);
                      return (
                        <tr key={p.id} style={{ borderBottom: "1px solid #1e2d45", background: p.priceAlert ? "rgba(245,158,11,0.05)" : "transparent" }}>
                          <td style={{ padding: "13px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 20 }}>{p.emoji}</span>
                              <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "13px 14px", color: "#64748b", fontSize: 12 }}>{p.supplier}</td>
                          <td style={{ padding: "13px 14px" }}>
                            <span style={{ fontFamily: "monospace", fontSize: 13, color: p.priceAlert ? "#f59e0b" : "#e2e8f0" }}>${p.cost.toFixed(2)}</span>
                            {p.priceAlert && <div style={{ fontSize: 10, color: "#f59e0b" }}>⚠️ Changed +$1.20</div>}
                          </td>
                          <td style={{ padding: "13px 14px", fontFamily: "monospace", fontSize: 13 }}>${p.price.toFixed(2)}</td>
                          <td style={{ padding: "13px 14px", fontFamily: "monospace", fontSize: 13, color: parseInt(margin) > 30 ? "#10b981" : "#f59e0b" }}>{margin}%</td>
                          <td style={{ padding: "13px 14px" }}>
                            <button onClick={() => { setProducts(prev => prev.map(x => x.id === p.id ? { ...x, monitored: !x.monitored } : x)); notify(p.monitored ? "Monitoring off" : "Monitoring on"); }}
                              style={{ background: p.monitored ? "rgba(59,130,246,0.15)" : "transparent", border: "1px solid " + (p.monitored ? "#3b82f6" : "#1e2d45"), borderRadius: 6, padding: "5px 10px", color: p.monitored ? "#3b82f6" : "#64748b", fontSize: 12, cursor: "pointer" }}>
                              {p.monitored ? "📡 ON" : "📡 OFF"}
                            </button>
                          </td>
                          <td style={{ padding: "13px 14px" }}>
                            {p.priceAlert
                              ? <button onClick={() => { setProducts(prev => prev.map(x => x.id === p.id ? { ...x, priceAlert: false } : x)); notify("Price synced to WooCommerce!"); }}
                                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid #f59e0b", borderRadius: 6, padding: "5px 10px", color: "#f59e0b", fontSize: 11, cursor: "pointer" }}>
                                  Sync Price
                                </button>
                              : <span style={{ color: "#10b981", fontSize: 12 }}>✅ Up to date</span>
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AUTOMATION */}
          {page === "automate" && (
            <div>
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>Rules run in the background automatically. Toggle them on or off anytime.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {rules.map(r => (
                  <div key={r.id} style={{ background: "#111827", border: "1px solid " + (r.active ? "rgba(59,130,246,0.35)" : "#1e2d45"), borderRadius: 14, padding: "20px 22px", display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: 15 }}>{r.name}</span>
                        {r.active && <span style={{ background: "#052e16", border: "1px solid #16a34a", borderRadius: 12, padding: "1px 8px", color: "#4ade80", fontSize: 10 }}>ACTIVE</span>}
                      </div>
                      <div style={{ color: "#64748b", fontSize: 13, marginBottom: 10 }}>{r.desc}</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ background: "#1e1b4b", border: "1px solid #4338ca", borderRadius: 6, padding: "2px 10px", color: "#a5b4fc", fontSize: 11 }}>Trigger: {r.trigger}</span>
                        <span style={{ background: "#052e16", border: "1px solid #16a34a", borderRadius: 6, padding: "2px 10px", color: "#4ade80", fontSize: 11 }}>Action: {r.action}</span>
                      </div>
                    </div>
                    <button onClick={() => { setRules(prev => prev.map(x => x.id === r.id ? { ...x, active: !x.active } : x)); notify(r.active ? r.name + " disabled" : r.name + " enabled"); }}
                      style={{ background: r.active ? "rgba(59,130,246,0.15)" : "#1a1a2e", border: "1px solid " + (r.active ? "#3b82f6" : "#1e2d45"), borderRadius: 8, padding: "9px 18px", color: r.active ? "#3b82f6" : "#64748b", fontWeight: 600, fontSize: 13, minWidth: 90, cursor: "pointer" }}>
                      {r.active ? "Turn Off" : "Turn On"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUPPLIERS */}
          {page === "suppliers" && (
            <div>
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>Connect suppliers for one-click importing and automated order fulfillment.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {SUPPLIERS_LIST.map(s => (
                  <div key={s.name} style={{ background: "#111827", border: "1px solid " + (s.connected ? "rgba(22,163,74,0.4)" : "#1e2d45"), borderRadius: 14, padding: 22 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ fontSize: 28 }}>{s.emoji}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 16 }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: s.connected ? "#10b981" : "#64748b" }}>{s.connected ? "● Connected" : "○ Not connected"}</div>
                        </div>
                      </div>
                    </div>
                    {s.connected && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                        {[["Products", s.products], ["Orders Placed", s.orders]].map(([l, v]) => (
                          <div key={l} style={{ background: "#0a0f1a", borderRadius: 8, padding: 10, textAlign: "center" }}>
                            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "monospace" }}>{v}</div>
                            <div style={{ color: "#64748b", fontSize: 10 }}>{l}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer"
                        style={{ flex: 1, background: s.connected ? "rgba(59,130,246,0.15)" : "linear-gradient(135deg,#3b82f6,#6366f1)", border: "1px solid " + (s.connected ? "#3b82f6" : "transparent"), borderRadius: 8, padding: 9, textAlign: "center", color: s.connected ? "#3b82f6" : "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "block" }}>
                        {s.connected ? "Manage" : "Connect"}
                      </a>
                      <a href={s.plugin} target="_blank" rel="noopener noreferrer"
                        style={{ flex: 1, background: "#0d1a10", border: "1px solid #1a4020", borderRadius: 8, padding: 9, textAlign: "center", color: "#10b981", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "block" }}>
                        🔌 WooPlugin
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFIT CALCULATOR */}
          {page === "calculator" && <ProfitCalc notify={notify} />}

        </div>

        <div style={{ borderTop: "1px solid #1e2d45", padding: "12px 24px", textAlign: "center", color: "#64748b", fontSize: 11, fontFamily: "monospace" }}>
          DropRadar Pro · Free forever · Built for WooCommerce dropshippers
        </div>
      </div>
    </div>
  );
}

function ProfitCalc() {
  const [cost, setCost] = useState(5);
  const [price, setPrice] = useState(29.99);
  const [ship, setShip] = useState(3);
  const [ads, setAds] = useState(5);
  const [plat, setPlat] = useState("woocommerce");
  const [units, setUnits] = useState(50);

  const feeRates = { woocommerce: 0, shopify: 0.02, etsy: 0.065, amazon: 0.15, ebay: 0.1295 };
  const fee = price * (feeRates[plat] || 0);
  const profit = price - cost - ship - ads - fee;
  const margin = ((profit / price) * 100).toFixed(1);
  const statusColor = parseFloat(margin) > 30 ? "#10b981" : parseFloat(margin) > 15 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 860 }}>
      <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 14, padding: 28 }}>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 20 }}>Input Details</div>
        {[["Product Cost ($)", cost, setCost], ["Selling Price ($)", price, setPrice], ["Shipping ($)", ship, setShip], ["Ad Spend / Sale ($)", ads, setAds], ["Units / Month", units, setUnits]].map(([l, v, s]) => (
          <div key={l} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", color: "#64748b", fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{l}</label>
            <input type="number" value={v} onChange={e => s(parseFloat(e.target.value) || 0)}
              style={{ width: "100%", background: "#0a0f1a", border: "1px solid #1e2d45", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 15, fontFamily: "monospace", outline: "none", boxSizing: "border-box" }} />
          </div>
        ))}
        <label style={{ display: "block", color: "#64748b", fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Platform</label>
        <select value={plat} onChange={e => setPlat(e.target.value)}
          style={{ width: "100%", background: "#0a0f1a", border: "1px solid #1e2d45", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 14, fontFamily: "monospace", outline: "none" }}>
          <option value="woocommerce">WooCommerce (0% fee)</option>
          <option value="shopify">Shopify (2%)</option>
          <option value="etsy">Etsy (6.5%)</option>
          <option value="amazon">Amazon (15%)</option>
          <option value="ebay">eBay (12.95%)</option>
        </select>
      </div>
      <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 14, padding: 28 }}>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 20 }}>Results</div>
        <div style={{ background: profit > 0 ? "#052e16" : "#2b0d0d", border: "2px solid " + statusColor, borderRadius: 12, padding: 24, textAlign: "center", marginBottom: 20 }}>
          <div style={{ color: statusColor, fontSize: 44, fontWeight: 700, fontFamily: "monospace" }}>${profit.toFixed(2)}</div>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Profit per Sale</div>
          <div style={{ color: statusColor, fontSize: 22, fontWeight: 600, marginTop: 6 }}>{margin}% margin</div>
        </div>
        {[["Platform Fee", "$" + fee.toFixed(2)], ["ROAS Break-even", (price / ads).toFixed(2) + "x"], ["Monthly Revenue", "$" + (price * units).toFixed(0)], ["Monthly Profit", "$" + (profit * units).toFixed(0)], ["Yearly Profit", "$" + (profit * units * 12).toFixed(0)]].map(([l, v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #1e2d45" }}>
            <span style={{ color: "#64748b", fontSize: 13, fontFamily: "monospace" }}>{l}</span>
            <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, fontFamily: "monospace" }}>{v}</span>
          </div>
        ))}
        <div style={{ marginTop: 16, background: "#0a0f1a", borderRadius: 10, padding: "12px 16px", color: statusColor, fontSize: 13 }}>
          {parseFloat(margin) > 30 ? "✅ Excellent — go for it!" : parseFloat(margin) > 15 ? "⚠️ Okay — try to reduce ad spend or cost" : "❌ Too risky — rethink pricing"}
        </div>
      </div>
    </div>
  );
}
