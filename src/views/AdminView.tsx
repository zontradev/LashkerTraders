import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileSpreadsheet,
  TrendingUp,
  AlertTriangle,
  Clock,
  Printer,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  getAdminStats,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  getProducts,
  type Product,
  type OrderRecord,
  type ProductVariant,
} from '@/lib/services/store-data';
import { ORDER_STATUS_LABELS, formatDhakaDate, STORE_CONFIG } from '@/lib/constants';
import { useTranslation } from '@/i18n';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { importRowSchema } from '@/lib/validations/import';
import { importProductsCsvAdmin } from '@/lib/services/store-data';

export function AdminView() {
  const { formatPrice, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'import'>('overview');

  // Stats state
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Order inspection & status update state
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Bulk Import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importRows, setImportRows] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<Array<{ row: number; error: string }>>([]);
  const [importResult, setImportResult] = useState<{ created: number; updated: number; failed: number } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [s, o, p] = await Promise.all([
      getAdminStats(),
      getAllOrdersAdmin(),
      getProducts(),
    ]);
    setStats(s);
    setOrders(o);
    setProducts(p);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await updateOrderStatusAdmin(orderId, newStatus);
      if (res.success) {
        await loadData();
        if (selectedOrder?.id === orderId) {
          const updated = (await getAllOrdersAdmin()).find((o) => o.id === orderId);
          if (updated) setSelectedOrder(updated);
        }
      }
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Import File Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setImportErrors([]);
    setImportResult(null);

    const isCsv = file.name.endsWith('.csv');
    const reader = new FileReader();

    if (isCsv) {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            validateImportRows(results.data);
          },
        });
      };
      reader.readAsText(file);
    } else {
      // Excel (.xlsx, .xls)
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
        validateImportRows(json);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const validateImportRows = (rows: any[]) => {
    const errors: Array<{ row: number; error: string }> = [];
    const validRows: any[] = [];

    rows.forEach((row, idx) => {
      const res = importRowSchema.safeParse(row);
      if (!res.success) {
        const msg = Object.entries(res.error.flatten().fieldErrors)
          .map(([field, errs]) => `${field}: ${errs?.join(', ')}`)
          .join('; ');
        errors.push({ row: idx + 2, error: msg });
      } else {
        validRows.push(res.data);
      }
    });

    setImportRows(validRows);
    setImportErrors(errors);
  };

  const executeBulkImport = async () => {
    if (importRows.length === 0) return;
    setIsImporting(true);
    try {
      const res = await importProductsCsvAdmin(importRows);
      setImportResult(res);
      await loadData();
    } finally {
      setIsImporting(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">
        Loading admin console...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Admin Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs uppercase tracking-wider text-sky-700 font-bold">
            Back-Office Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lashker Traders Management Console
          </h1>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-sky-600" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-sky-600" />
            <span>Fulfillment ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-sky-600" />
            <span>Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
            <span>CSV / Excel Import</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8 animate-fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card">
              <div className="stat-icon-wrapper bg-sky-50 text-sky-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Sales</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                  {formatPrice(stats.totalRevenue)}
                </p>
                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Active Delivered Orders</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper bg-indigo-50 text-indigo-600">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Orders</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalOrders}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{stats.pendingOrders} pending review</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper bg-amber-50 text-amber-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Low Stock SKUs</p>
                <p className="text-2xl font-extrabold text-amber-700 mt-0.5">{stats.lowStockCount}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">&le; 15 packs remaining</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper bg-rose-50 text-rose-600">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Out of Stock</p>
                <p className="text-2xl font-extrabold text-rose-700 mt-0.5">{stats.outOfStockCount}</p>
                <p className="text-[11px] text-rose-600 font-medium mt-0.5">Requires warehouse restock</p>
              </div>
            </div>
          </div>

          {/* Recent Orders List */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Recent Customer Orders</h2>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Zone</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((o: OrderRecord) => (
                    <tr key={o.id}>
                      <td className="font-mono font-bold text-sky-700">{o.orderNumber}</td>
                      <td className="font-semibold text-slate-800">{o.customerName}</td>
                      <td className="font-mono text-xs">{o.customerPhone}</td>
                      <td>{o.deliveryZoneName}</td>
                      <td className="font-extrabold text-slate-900">{formatPrice(o.total)}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            ORDER_STATUS_LABELS[o.orderStatus]?.color || 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {ORDER_STATUS_LABELS[o.orderStatus]?.label || o.orderStatus}
                        </span>
                      </td>
                      <td className="text-xs text-slate-500">{formatDhakaDate(o.createdAt)}</td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedOrder(o);
                            setActiveTab('orders');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in">
          {/* Order Search & Status Filter */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order #, customer name, or phone..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-8 text-xs outline-hidden focus:bg-white focus:border-sky-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={loadData}
              className="text-xs font-semibold text-slate-600 hover:text-sky-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Orders</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Orders Table */}
            <div className={`admin-table-container ${selectedOrder ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        No orders matching the filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr
                        key={o.id}
                        className={selectedOrder?.id === o.id ? 'bg-sky-50/70 font-semibold' : ''}
                      >
                        <td className="font-mono font-bold text-sky-700">{o.orderNumber}</td>
                        <td>{o.customerName}</td>
                        <td className="font-mono text-xs">{o.customerPhone}</td>
                        <td className="font-extrabold">{formatPrice(o.total)}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              ORDER_STATUS_LABELS[o.orderStatus]?.color || 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {ORDER_STATUS_LABELS[o.orderStatus]?.label || o.orderStatus}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold cursor-pointer"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Selected Order Drawer Panel */}
            {selectedOrder && (
              <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-md printable-slip">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold font-mono text-slate-900">
                      {selectedOrder.orderNumber}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {formatDhakaDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 no-print">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Print Packing Slip / Courier Invoice"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Slip</span>
                    </button>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                </div>

                {/* Status Updater */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 no-print">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Update Order Status
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                      disabled={updatingOrderId === selectedOrder.id}
                      className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-hidden"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Packaging & Quality Check</option>
                      <option value="shipped">Handed to Courier</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled (Restores Stock)</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    * Selecting &ldquo;Cancelled&rdquo; restores variant inventory counts safely and logged in audit log.
                  </p>
                </div>

                {/* Recipient Details */}
                <div className="space-y-1 text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                    Delivery Recipient
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{selectedOrder.customerName}</p>
                  <p className="font-mono text-slate-700">{selectedOrder.customerPhone}</p>
                  <p className="text-slate-600 whitespace-pre-line">{selectedOrder.deliveryAddress}</p>
                  <p className="text-sky-700 font-semibold mt-1">Zone: {selectedOrder.deliveryZoneName}</p>
                </div>

                {/* Line Items */}
                <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                    Order Items ({selectedOrder.items.length})
                  </span>
                  <div className="divide-y divide-slate-100">
                    {selectedOrder.items.map((i) => (
                      <div key={i.id} className="py-2 flex justify-between">
                        <div>
                          <p className="font-bold text-slate-800">{i.productName}</p>
                          <p className="text-[11px] text-slate-500">
                            Size {i.size} ({i.packCount} pcs) &times; {i.quantity}
                          </p>
                        </div>
                        <span className="font-extrabold text-slate-900">
                          {formatPrice(i.subtotal)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 flex justify-between font-semibold text-slate-600">
                      <span>Delivery Fee</span>
                      <span>{formatPrice(selectedOrder.deliveryCharge)}</span>
                    </div>
                    <div className="pt-2 flex justify-between font-extrabold text-slate-900 text-sm">
                      <span>Total Payable (COD)</span>
                      <span className="text-sky-700">{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Diaper Catalog & Stock Inventory</h2>
              <p className="text-xs text-slate-500">Real-time variant pack counts across sizes S through XXXL</p>
            </div>
            <button
              onClick={() => setActiveTab('import')}
              className="btn-primary text-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Bulk CSV / Excel Import</span>
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Brand</th>
                  <th>Size Variants & Pack Stock</th>
                  <th>Base Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={p.mainImage}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs font-semibold text-slate-700">{p.brand}</td>
                    <td>
                      <div className="flex flex-wrap gap-1.5 py-1">
                        {p.variants.map((v) => (
                          <span
                            key={v.id}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              v.stockQuantity === 0
                                ? 'bg-rose-50 border-rose-200 text-rose-700'
                                : v.stockQuantity <= 15
                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            }`}
                          >
                            Size {v.size}: {v.stockQuantity} pcs ({formatPrice(v.price)})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="font-extrabold text-slate-900">{formatPrice(p.basePrice)}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          p.isPublished
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        {p.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BULK CSV / EXCEL IMPORT */}
      {activeTab === 'import' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 space-y-6 shadow-xs animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900">CSV / Excel Bulk Product Import Center</h2>
            <p className="text-xs text-slate-500 mt-1">
              Upload supplier inventory spreadsheets with automatic row-level Zod validation before saving.
            </p>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-3 hover:border-sky-400 transition-colors bg-slate-50/50">
            <FileSpreadsheet className="w-12 h-12 text-sky-600 mx-auto" />
            <div>
              <p className="text-sm font-bold text-slate-800">
                Choose a CSV (.csv) or Excel (.xlsx, .xls) spreadsheet
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Required columns: brand, category, product_name, variant_sku, size, pack_count, price, stock_quantity
              </p>
            </div>
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
              className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
            />
          </div>

          {/* Error Table if validation failed */}
          {importErrors.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <h3 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Found {importErrors.length} Row Validation Errors:</span>
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-1 text-[11px] text-rose-800 font-mono">
                {importErrors.map((e, idx) => (
                  <p key={idx}>Row {e.row}: {e.error}</p>
                ))}
              </div>
            </div>
          )}

          {/* Parsed Valid Rows Preview */}
          {importRows.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-emerald-700">
                  ✔ {importRows.length} valid rows ready for import.
                </p>
                <button
                  onClick={executeBulkImport}
                  disabled={isImporting}
                  className="btn-primary text-xs"
                >
                  {isImporting ? 'Importing Products...' : `Import ${importRows.length} Products`}
                </button>
              </div>

              <div className="admin-table-container max-h-60 overflow-y-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>SKU</th>
                      <th>Size</th>
                      <th>Packs</th>
                      <th>Price</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importRows.slice(0, 10).map((r, i) => (
                      <tr key={i}>
                        <td className="font-semibold text-xs">{r.product_name}</td>
                        <td className="font-mono text-xs">{r.variant_sku}</td>
                        <td className="font-bold">{r.size}</td>
                        <td>{r.pack_count} pcs</td>
                        <td className="font-extrabold">{formatPrice(r.price)}</td>
                        <td>{r.stock_quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Success summary */}
          {importResult && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <p className="font-bold">Import Completed Successfully!</p>
              <p>Created: {importResult.created} products | Updated: {importResult.updated} | Failed: {importResult.failed}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
