import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const DataContext = createContext();

const generateId = (prefix) => prefix + Math.random().toString(36).substr(2, 5).toUpperCase();

const initialState = {
  categories: [
    { id: 'C1', name: 'Gà Nguyên Con', type: 'menu' },
    { id: 'C2', name: 'Combo Đóng Hộp', type: 'menu' },
    { id: 'C3', name: 'Gia vị tẩm ướp', type: 'inventory' },
    { id: 'C4', name: 'Đồ Nhựa Hộp Túi', type: 'inventory' }
  ],
  salesChannels: [
    { id: 'CH1', name: 'Biên Lai Tiệm (Trực Tiếp)', discountRate: 0 },
    { id: 'CH2', name: 'ShopeeFood', discountRate: 25 },
    { id: 'CH3', name: 'GrabFood', discountRate: 30 }
  ],
  ingredients: [
    { id: 'NL1', name: 'Gà Ta Làm Sạch', category: 'Gia vị tẩm ướp', unit: 'Con', buyUnit: 'Lồng', conversionRate: 15, stock: 120, cost: 75000 },
    { id: 'NL2', name: 'Túi Tráng Bạc', category: 'Đồ Nhựa Hộp Túi', unit: 'Cái', buyUnit: 'Kg', conversionRate: 100, stock: 500, cost: 300 },
    { id: 'NL3', name: 'Chai Nước Chấm Khối', category: 'Gia vị tẩm ướp', unit: 'Chai', buyUnit: 'Thùng', conversionRate: 20, stock: 50, cost: 20000 },
    { id: 'NL4', name: 'Hộp Nhựa Chấm Con', category: 'Đồ Nhựa Hộp Túi', unit: 'Cái', buyUnit: 'Cây', conversionRate: 50, stock: 400, cost: 500 },
    { id: 'NL5', name: 'Xôi Ruốc Heo', category: 'Combo Đóng Hộp', unit: 'Suất', stock: 100, cost: 12000 },
    { id: 'NL6', name: 'Tai Heo Ủ Muối', category: 'Gà Nguyên Con', unit: 'Cái', stock: 50, cost: 45000 },
    { id: 'NL7', name: 'Gà Ủ Xi Dầu (Gốc)', category: 'Gà Nguyên Con', unit: 'Con', stock: 30, cost: 85000 },
    { id: 'NL8', name: 'Chân Gà Rút Xương', category: 'Combo Đóng Hộp', unit: 'Phần', stock: 60, cost: 55000 }
  ],
  products: [
    { id: 'P1', name: 'Nước Chấm Cốc Nhỏ (Thành phẩm)', category: 'Gia vị tẩm ướp', price: 0, image: '', recipe: [
      { ingredientId: 'NL3', qty: 0.1, unitMode: 'base' },
      { ingredientId: 'NL4', qty: 1, unitMode: 'base' }
    ]},
    { id: 'P2', name: 'Gà Nguyên Con Ủ Muối', category: 'Gà Nguyên Con', price: 165000, image: '', recipe: [
      { ingredientId: 'NL1', qty: 1, unitMode: 'base' },
      { ingredientId: 'NL2', qty: 1, unitMode: 'base' },
      { ingredientId: 'P1', qty: 2, unitMode: 'base' } // Đệ quy: 2 phần nước chấm
    ]},
    { id: 'CB1', name: 'Gà Ủ Muối 1/2 Con + Xôi Ruốc Heo', category: 'Combo Đóng Hộp', price: 108900, status: 'draft', recipe: [
      { ingredientId: 'NL1', qty: 0.5, unitMode: 'base' },
      { ingredientId: 'NL5', qty: 1, unitMode: 'base' },
      { ingredientId: 'NL2', qty: 1, unitMode: 'base' }
    ]},
    { id: 'CB2', name: 'Gà Ủ Muối Nguyên Con + Xôi Ruốc Heo', category: 'Combo Đóng Hộp', price: 185800, status: 'draft', recipe: [
      { ingredientId: 'NL1', qty: 1, unitMode: 'base' },
      { ingredientId: 'NL5', qty: 1, unitMode: 'base' },
      { ingredientId: 'NL2', qty: 1, unitMode: 'base' }
    ]},
    { id: 'CB3', name: 'Set Gà Ủ Muối 1/2 Con + Tai Heo Ủ Muối + Xôi Ruốc Nóng', category: 'Combo Đóng Hộp', price: 193000, status: 'draft', recipe: [
      { ingredientId: 'NL1', qty: 0.5, unitMode: 'base' },
      { ingredientId: 'NL6', qty: 1, unitMode: 'base' },
      { ingredientId: 'NL5', qty: 1, unitMode: 'base' },
      { ingredientId: 'NL2', qty: 1, unitMode: 'base' }
    ]},
    { id: 'CB4', name: 'Gà Ủ Muối Nguyên Con + Tai Heo Ủ Muối', category: 'Combo Đóng Hộp', price: 240800, status: 'draft', recipe: [
      { ingredientId: 'NL1', qty: 1, unitMode: 'base' },
      { ingredientId: 'NL6', qty: 1, unitMode: 'base' },
      { ingredientId: 'NL2', qty: 1, unitMode: 'base' }
    ]},
    { id: 'CB5', name: 'Gà Ủ Xi Dầu 1/2 Con + Xôi Ruốc Heo', category: 'Combo Đóng Hộp', price: 109000, status: 'draft', recipe: [
      { ingredientId: 'NL7', qty: 0.5, unitMode: 'base' },
      { ingredientId: 'NL5', qty: 1, unitMode: 'base' },
      { ingredientId: 'NL2', qty: 1, unitMode: 'base' }
    ]},
    { id: 'CB6', name: 'Gà Ủ Xi Dầu 1/2 Con + Gà Ủ Muối 1/2 Con + Xôi Ruốc Nóng', category: 'Combo Đóng Hộp', price: 186000, status: 'draft', recipe: [
      { ingredientId: 'NL7', qty: 0.5, unitMode: 'base' },
      { ingredientId: 'NL1', qty: 0.5, unitMode: 'base' },
      { ingredientId: 'NL5', qty: 1, unitMode: 'base' },
      { ingredientId: 'NL2', qty: 1, unitMode: 'base' }
    ]},
    { id: 'CB7', name: 'Gà Ủ Xi Dầu 1/2 con + Gà Ủ Muối 1/2 Con', category: 'Combo Đóng Hộp', price: 157000, status: 'draft', recipe: [
      { ingredientId: 'NL7', qty: 0.5, unitMode: 'base' },
      { ingredientId: 'NL1', qty: 0.5, unitMode: 'base' },
      { ingredientId: 'NL2', qty: 1, unitMode: 'base' }
    ]},
    { id: 'CB8', name: 'Gà Ủ Muối Nguyên Con + Chân Gà Rút Xương', category: 'Combo Đóng Hộp', price: 237800, status: 'draft', recipe: [
      { ingredientId: 'NL1', qty: 1, unitMode: 'base' },
      { ingredientId: 'NL8', qty: 1, unitMode: 'base' },
      { ingredientId: 'NL2', qty: 1, unitMode: 'base' }
    ]},
    { id: 'CB9', name: 'Gà Ủ Muối 1/2 con + Tai Heo Ủ Muối', category: 'Combo Đóng Hộp', price: 164000, status: 'draft', recipe: [
      { ingredientId: 'NL1', qty: 0.5, unitMode: 'base' },
      { ingredientId: 'NL6', qty: 1, unitMode: 'base' },
      { ingredientId: 'NL2', qty: 1, unitMode: 'base' }
    ]},
    { id: 'CB10', name: 'Gà Ủ Muối 1/2 Con + Chân Gà Ủ Muối Rút Xương', category: 'Combo Đóng Hộp', price: 160900, status: 'draft', recipe: [
      { ingredientId: 'NL1', qty: 0.5, unitMode: 'base' },
      { ingredientId: 'NL8', qty: 1, unitMode: 'base' },
      { ingredientId: 'NL2', qty: 1, unitMode: 'base' }
    ]}
  ],
  suppliers: [
    { id: 'SUP1', name: 'Lò Mổ Anh Tuấn', phone: '0987654321', email: 'Lấy gà tươi sống rạng sáng' },
    { id: 'SUP2', name: 'Đại Lý Bao Bì Kim Ngân', phone: '0909090909', email: 'Ship túi bóng, hộp giấy' }
  ],
  purchaseOrders: [],
  posOrders: [],
  accounts: [
    { id: 'ACC1', name: 'Tiền mặt tại quầy', balance: 5000000, type: 'cash', initialBalance: 5000000 },
    { id: 'ACC2', name: 'Techcombank (Hội sở)', balance: 50000000, type: 'bank', initialBalance: 50000000 },
    { id: 'ACC3', name: 'Ví ShopeePay', balance: 0, type: 'e-wallet', initialBalance: 0 },
    { id: 'ACC4', name: 'Ví GrabMerchant', balance: 0, type: 'e-wallet', initialBalance: 0 }
  ],
  financeCategories: [
    { id: 'FC1', name: 'Doanh thu bán hàng', type: 'income' },
    { id: 'FC2', name: 'Thu nợ khách hàng', type: 'income' },
    { id: 'FC3', name: 'Vốn chủ sở hữu', type: 'income' },
    { id: 'FC4', name: 'Nhập hàng nguyên liệu', type: 'expense' },
    { id: 'FC5', name: 'Lương nhân viên', type: 'expense' },
    { id: 'FC6', name: 'Tiền mặt bằng', type: 'expense' },
    { id: 'FC7', name: 'Điện nước internet', type: 'expense' },
    { id: 'FC8', name: 'Phí sàn (Grab/Shopee)', type: 'expense' },
    { id: 'FC9', name: 'Chi phí khác', type: 'expense' },
    { id: 'FC10', name: 'Điều chỉnh số dư', type: 'income' }
  ],
  transactions: [],
  settings: {
    theme: 'dark',
    syncMode: 'auto'
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'HYDRATE_STATE': {
      const incoming = action.payload;
      // Đảm bảo không mất Combo mẫu khi hydrate từ Firebase
      const mergedProducts = [...(incoming.products || [])];
      initialState.products.forEach(p => {
         if (!mergedProducts.find(mp => mp.name === p.name)) {
            mergedProducts.push(p);
         }
      });
      const mergedIngredients = [...(incoming.ingredients || [])];
      initialState.ingredients.forEach(i => {
         if (!mergedIngredients.find(mi => mi.name === i.name)) {
            mergedIngredients.push(i);
         }
      });
      return { ...state, ...incoming, products: mergedProducts, ingredients: mergedIngredients };
    }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    // Categories
    case 'ADD_CATEGORY': return { ...state, categories: [...state.categories, { ...action.payload, id: generateId('CAT-') }] };
    case 'UPDATE_CATEGORY': return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CATEGORY': return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };

    // Sales Channels
    case 'ADD_CHANNEL': return { ...state, salesChannels: [...(state.salesChannels||[]), { ...action.payload, id: generateId('CH-') }] };
    case 'UPDATE_CHANNEL': return { ...state, salesChannels: (state.salesChannels||[]).map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CHANNEL': return { ...state, salesChannels: (state.salesChannels||[]).filter(c => c.id !== action.payload) };

    // Accounts (NEW V8)
    case 'ADD_ACCOUNT': return { ...state, accounts: [...state.accounts, { ...action.payload, id: generateId('ACC-'), balance: Number(action.payload.initialBalance || 0), initialBalance: Number(action.payload.initialBalance || 0) }] };
    case 'UPDATE_ACCOUNT': return { ...state, accounts: state.accounts.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'DELETE_ACCOUNT': return { ...state, accounts: state.accounts.filter(a => a.id !== action.payload) };

    // Finance Categories (NEW V8)
    case 'ADD_FINANCE_CATEGORY': return { ...state, financeCategories: [...state.financeCategories, { ...action.payload, id: generateId('FC-') }] };
    case 'UPDATE_FINANCE_CATEGORY': return { ...state, financeCategories: state.financeCategories.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_FINANCE_CATEGORY': return { ...state, financeCategories: state.financeCategories.filter(c => c.id !== action.payload) };

    // Money Transfer (NEW V8)
    case 'TRANSFER_FUNDS': {
      const { fromId, toId, amount, fee, note, date } = action.payload;
      const transferDate = date || new Date().toISOString();
      const transferAmount = Number(amount);
      const transferFee = Number(fee || 0);

      const outTransaction = {
        id: generateId('GD-'),
        date: transferDate,
        type: 'Chi',
        categoryId: 'FC9', // Khác hoặc Luân chuyển
        accountId: fromId,
        amount: transferAmount + transferFee,
        note: `[LUÂN CHUYỂN] Chuyển đến ví khác. ${note || ''}`
      };

      const inTransaction = {
        id: generateId('GD-'),
        date: transferDate,
        type: 'Thu',
        categoryId: 'FC9', 
        accountId: toId,
        amount: transferAmount,
        note: `[LUÂN CHUYỂN] Nhận từ ví khác. ${note || ''}`
      };

      return {
        ...state,
        transactions: [outTransaction, inTransaction, ...state.transactions],
        accounts: state.accounts.map(acc => {
          if (acc.id === fromId) return { ...acc, balance: acc.balance - (transferAmount + transferFee) };
          if (acc.id === toId) return { ...acc, balance: acc.balance + transferAmount };
          return acc;
        })
      };
    }

    case 'DELETE_TRANSACTION': {
      const transaction = state.transactions.find(t => t.id === action.payload);
      if (!transaction) return state;
      
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
        accounts: state.accounts.map(acc => {
          if (acc.id === transaction.accountId) {
             const adjustment = transaction.type === 'Thu' ? -transaction.amount : transaction.amount;
             return { ...acc, balance: acc.balance + adjustment };
          }
          return acc;
        })
      };
    }

    case 'UPDATE_TRANSACTION': {
      const { id, ...updates } = action.payload;
      const oldT = state.transactions.find(t => t.id === id);
      if (!oldT) return state;

      return {
        ...state,
        transactions: state.transactions.map(t => t.id === id ? { ...t, ...updates } : t),
        accounts: state.accounts.map(acc => {
          if (acc.id === oldT.accountId) {
            // Revert old, apply new
            const oldAdj = oldT.type === 'Thu' ? -oldT.amount : oldT.amount;
            const newAdj = updates.type === 'Thu' ? updates.amount : -updates.amount;
            return { ...acc, balance: acc.balance + oldAdj + newAdj };
          }
          return acc;
        })
      };
    }

    // Adjust Account Balance (Actual vs Virtual)
    case 'ADJUST_BALANCE': {
      const { accountId, actualBalance, note } = action.payload;
      const acc = state.accounts.find(a => a.id === accountId);
      if (!acc) return state;

      const diff = actualBalance - acc.balance;
      if (diff === 0) return state;

      const adjustmentTransaction = {
        id: generateId('GD-'),
        voucherCode: diff > 0 ? `PT-${Date.now().toString().slice(-6)}` : `PC-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        type: diff > 0 ? 'Thu' : 'Chi',
        categoryId: 'FC10',
        accountId: accountId,
        amount: Math.abs(diff),
        note: `[ĐIỀU CHỈNH SỐ DƯ] ${note || 'Khớp số dư thực tế.'}`,
        collector: 'Hệ thống',
        payer: 'Admin'
      };

      return {
        ...state,
        transactions: [adjustmentTransaction, ...state.transactions],
        accounts: state.accounts.map(a => a.id === accountId ? { ...a, balance: actualBalance } : a)
      };
    }

    // Ingredients & Products
    case 'ADD_INGREDIENT': return { ...state, ingredients: [...state.ingredients, { ...action.payload, id: generateId('NL-') }] };
    case 'UPDATE_INGREDIENT': return { ...state, ingredients: state.ingredients.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'DELETE_INGREDIENT': return { ...state, ingredients: state.ingredients.filter(i => i.id !== action.payload) };
    case 'ADJUST_STOCK': return { 
      ...state, 
      ingredients: state.ingredients.map(i => i.id === action.payload.id ? { ...i, stock: action.payload.newStock } : i) 
    };

    case 'ADD_PRODUCT': return { ...state, products: [...state.products, { ...action.payload, id: generateId('SP-'), status: action.payload.status || 'active' }] };
    case 'UPDATE_PRODUCT': return { ...state, products: state.products.map(p => p.id === action.payload.id ? { ...p, ...action.payload } : p) };
    case 'DELETE_PRODUCT': return { ...state, products: state.products.filter(p => p.id !== action.payload) };

    // Suppliers
    case 'ADD_SUPPLIER': return { ...state, suppliers: [...state.suppliers, { ...action.payload, id: generateId('SUP-') }] };
    case 'UPDATE_SUPPLIER': return { ...state, suppliers: state.suppliers.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_SUPPLIER': return { ...state, suppliers: state.suppliers.filter(s => s.id !== action.payload) };

    // Purchase Orders (Kho & Công Nợ)
    case 'UPDATE_POS_ORDER_STATUS': {
      const { id, paymentStatus } = action.payload;
      return {
        ...state,
        posOrders: state.posOrders.map(o => o.id === id ? { ...o, paymentStatus } : o)
      };
    }

    case 'ADD_PURCHASE_ORDER': {
      const order = action.payload; 
      const newPO = { ...order, id: generateId('NK-'), date: new Date().toISOString() };
      
      let updatedIngredients = [...state.ingredients];
      order.items.forEach(poItem => {
        const ingIndex = updatedIngredients.findIndex(i => i.id === poItem.ingredientId);
        if (ingIndex !== -1) {
          const ing = updatedIngredients[ingIndex];
          const newStock = ing.stock + poItem.baseQty;
          
          const oldTotalCost = ing.stock * ing.cost;
          const newTotalCost = oldTotalCost + poItem.itemTotal;
          const avgCost = newTotalCost / newStock;

          updatedIngredients[ingIndex] = { ...ing, stock: newStock, cost: avgCost };
        }
      });

      const newState = { ...state, purchaseOrders: [...state.purchaseOrders, newPO], ingredients: updatedIngredients };
      
      if (newPO.status === 'Paid') {
        const transaction = {
          id: generateId('GD-'),
          date: newPO.date,
          type: 'Chi',
          amount: newPO.totalAmount,
          note: `XUẤT QUỸ: Nhập hàng trả luôn (${newPO.id})`,
          balanceAfter: state.balance - newPO.totalAmount
        };
        newState.transactions = [transaction, ...state.transactions];
        newState.balance = transaction.balanceAfter;
      }
      return newState;
    }

    case 'UPDATE_PURCHASE_ORDER_STATUS': {
      const { id, status } = action.payload;
      const po = state.purchaseOrders.find(p => p.id === id);
      if (!po || po.status === status) return state;

      const updatedPOs = state.purchaseOrders.map(p => p.id === id ? { ...p, status } : p);
      let newState = { ...state, purchaseOrders: updatedPOs };

      if (status === 'Paid') {
        const transaction = {
          id: generateId('GD-'),
          date: new Date().toISOString(),
          type: 'Chi',
          amount: po.totalAmount,
          note: `XUẤT QUỸ BÙ NỢ: Thanh toán công nợ hóa đơn nhập (${po.id})`,
          balanceAfter: state.balance - po.totalAmount
        };
        newState.transactions = [transaction, ...state.transactions];
        newState.balance = transaction.balanceAfter;
      }
      return newState;
    }

    case 'DELETE_PURCHASE_ORDER': {
      const poId = action.payload;
      const po = state.purchaseOrders.find(p => p.id === poId);
      if (!po) return state;

      let updatedIngredients = [...state.ingredients];
      po.items.forEach(poItem => {
        const ingIndex = updatedIngredients.findIndex(i => i.id === poItem.ingredientId);
        if (ingIndex !== -1) {
          const ing = updatedIngredients[ingIndex];
          updatedIngredients[ingIndex] = { ...ing, stock: Math.max(0, ing.stock - poItem.baseQty) };
        }
      });

      const remainingPOs = state.purchaseOrders.filter(p => p.id !== poId);
      const newState = { ...state, purchaseOrders: remainingPOs, ingredients: updatedIngredients };

      if (po.status === 'Paid') {
        const transaction = {
          id: generateId('GD-'),
          date: new Date().toISOString(),
          type: 'Thu',
          amount: po.totalAmount,
          note: `HOÀN QUỸ KHO: Xóa phiếu nhập/Khử trả hàng (${po.id})`,
          balanceAfter: state.balance + po.totalAmount
        };
        newState.transactions = [transaction, ...state.transactions];
        newState.balance = transaction.balanceAfter;
      }
      return newState;
    }

    // POS & Transactions (WITH SUB-RECIPE RECURSION)
    case 'ADD_POS_ORDER': {
      const order = action.payload; // Contains channelName, discountRate, total, netAmount
      const newOrder = { 
        id: order.orderCode || generateId('DH-'), 
        customerName: order.customerName || '',
        customerPhone: order.customerPhone || '',
        extraFee: order.extraFee || 0,
        extraFeeNote: order.extraFeeNote || '',
        ...order, 
        date: new Date().toISOString(),
        status: order.status || 'Pending' // Default to Pending (Chờ ship)
      };
      
      let updatedIngredients = [...state.ingredients];
      
      // HÀM ĐỆ QUY TÌM RỄ KHỬ TỒN KHO NGUYÊN LIỆU (TRỪ MÓN PHỤ TRONG MÓN CHÍNH)
      const deductIngredients = (recipe, quantityMultiplier) => {
         if (!recipe) return;
         recipe.forEach(recItem => {
           const subProduct = state.products.find(p => p.id === recItem.ingredientId);
           if (subProduct) {
             const subQty = recItem.unitMode === 'divide' ? (1 / recItem.qty) : recItem.qty;
             deductIngredients(subProduct.recipe, quantityMultiplier * subQty);
           } else {
             const ingIndex = updatedIngredients.findIndex(i => i.id === recItem.ingredientId);
             if (ingIndex !== -1) {
               const ing = updatedIngredients[ingIndex];
               let deductBaseQty = recItem.qty;
               if (recItem.unitMode === 'buy') deductBaseQty = recItem.qty * (ing.conversionRate || 1);
               if (recItem.unitMode === 'divide') deductBaseQty = 1 / recItem.qty;
               
               updatedIngredients[ingIndex] = { ...ing, stock: Math.max(0, ing.stock - (deductBaseQty * quantityMultiplier)) };
             }
           }
         });
      };

      order.items.forEach(cartItem => {
         deductIngredients(cartItem.product.recipe, cartItem.quantity);
      });

      // LẬP PHIẾU THU TÀI CHÍNH THEO "SỐ THỰC NHẬN" (NET AMOUNT)
      let targetAccountId = 'ACC1'; // Mặc định tiền mặt
      if (newOrder.channelName === 'ShopeeFood') targetAccountId = 'ACC3';
      if (newOrder.channelName === 'GrabFood') targetAccountId = 'ACC4';

      const transaction = {
        id: generateId('GD-'),
        date: newOrder.date,
        type: 'Thu',
        categoryId: 'FC1', // Gắn danh mục Doanh Thu Bán Hàng
        accountId: targetAccountId,
        amount: newOrder.netAmount + (Number(newOrder.extraFee) || 0), 
        note: `Doanh thu POS (${newOrder.id}) - Khách: ${newOrder.customerName || 'vãng lai'}`,
      };
      
      return { 
        ...state, 
        posOrders: [newOrder, ...state.posOrders],
        ingredients: updatedIngredients,
        transactions: [transaction, ...state.transactions],
        accounts: state.accounts.map(acc => {
          if (acc.id === targetAccountId) {
            return { ...acc, balance: acc.balance + transaction.amount };
          }
          return acc;
        })
      };
    }

    case 'UPDATE_ORDER_STATUS': {
      const { orderId, status } = action.payload;
      const order = state.posOrders.find(o => o.id === orderId);
      if (!order || order.status === status) return state;

      let updatedIngredients = [...state.ingredients];

      // LOGIC HOÀN KHO KHI HUỶ / TRỪ KHO KHI PHỤC HỒI
      const adjustInventory = (recipe, quantityMultiplier, isDeduct) => {
        if (!recipe) return;
        recipe.forEach(recItem => {
          const subProduct = state.products.find(p => p.id === recItem.ingredientId);
          if (subProduct) {
            const subQty = recItem.unitMode === 'divide' ? (1 / recItem.qty) : recItem.qty;
            adjustInventory(subProduct.recipe, quantityMultiplier * subQty, isDeduct);
          } else {
            const ingIndex = updatedIngredients.findIndex(i => i.id === recItem.ingredientId);
            if (ingIndex !== -1) {
              const ing = updatedIngredients[ingIndex];
              let baseQty = recItem.qty;
              if (recItem.unitMode === 'buy') baseQty = recItem.qty * (ing.conversionRate || 1);
              if (recItem.unitMode === 'divide') baseQty = 1 / recItem.qty;
              
              const change = baseQty * quantityMultiplier;
              updatedIngredients[ingIndex] = { 
                ...ing, 
                stock: isDeduct ? Math.max(0, ing.stock - change) : (ing.stock + change) 
              };
            }
          }
        });
      };

      // Nếu chuyển sang trạng thái Cancelled -> Hoàn kho
      if (status === 'Cancelled') {
        order.items.forEach(item => adjustInventory(item.product.recipe, item.quantity, false));
      } 
      // Nếu từ Cancelled chuyển về status khác -> Trừ kho lại
      else if (order.status === 'Cancelled') {
        order.items.forEach(item => adjustInventory(item.product.recipe, item.quantity, true));
      }

      return {
        ...state,
        ingredients: updatedIngredients,
        posOrders: state.posOrders.map(o => o.id === orderId ? { ...o, status } : o)
      };
    }

    case 'DELETE_POS_ORDER': {
      const orderId = action.payload;
      const order = state.posOrders.find(o => o.id === orderId);
      if (!order) return state;

      let updatedIngredients = [...state.ingredients];
      // Nếu đơn chưa bị huỷ (vẫn đang chiếm kho) thì phải hoàn kho trước khi xóa
      if (order.status !== 'Cancelled') {
        const adjustInventory = (recipe, quantityMultiplier) => {
          if (!recipe) return;
          recipe.forEach(recItem => {
            const subProduct = state.products.find(p => p.id === recItem.ingredientId);
            if (subProduct) {
              const subQty = recItem.unitMode === 'divide' ? (1 / recItem.qty) : recItem.qty;
              adjustInventory(subProduct.recipe, quantityMultiplier * subQty);
            } else {
              const ingIndex = updatedIngredients.findIndex(i => i.id === recItem.ingredientId);
              if (ingIndex !== -1) {
                const ing = updatedIngredients[ingIndex];
                let baseQty = recItem.qty;
                if (recItem.unitMode === 'buy') baseQty = recItem.qty * (ing.conversionRate || 1);
                if (recItem.unitMode === 'divide') baseQty = 1 / recItem.qty;
                updatedIngredients[ingIndex] = { ...ing, stock: ing.stock + (baseQty * quantityMultiplier) };
              }
            }
          });
        };
        order.items.forEach(item => adjustInventory(item.product.recipe, item.quantity));
      }

      return {
        ...state,
        ingredients: updatedIngredients,
        posOrders: state.posOrders.filter(o => o.id !== orderId)
      };
    }

    case 'ADD_TRANSACTION': {
      const amount = Number(action.payload.amount) || 0;
      const type = action.payload.type || 'Thu';
      const t = { 
        ...action.payload, 
        id: generateId('GD-'), 
        voucherCode: action.payload.voucherCode || (type === 'Thu' ? `PT-${Date.now().toString().slice(-6)}` : `PC-${Date.now().toString().slice(-6)}`),
        date: action.payload.date || new Date().toISOString(),
        amount
      };
      return {
        ...state,
        transactions: [t, ...state.transactions],
        accounts: state.accounts.map(acc => {
          if (acc.id === t.accountId) {
             return { ...acc, balance: acc.balance + (t.type === 'Thu' ? amount : -amount) };
          }
          return acc;
        })
      };
    }
    
    case 'IMPORT_DAILY_SALES': {
      const { channel, rawData } = action.payload;
      console.log(`[Import] Starting import for channel: ${channel}`);
      let newOrders = [];
      let newTransactions = [];
      const timestamp = new Date().getTime();
      
      try {
        if (channel === 'Shopee') {
          const lines = rawData.split('\n').filter(l => l.trim().length > 0 && !l.startsWith('STT'));
          lines.forEach((line, index) => {
            const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (parts.length >= 12) {
              const orderIdString = parts[1];
              const rawDateStr = parts[4]; // 20/03/2026 11:27:28
              
              // Convert DD/MM/YYYY HH:mm:ss to YYYY-MM-DDTHH:mm:ss
              let dateStr = rawDateStr;
              if (rawDateStr && rawDateStr.includes('/')) {
                const [dmy, hms] = rawDateStr.split(' ');
                const [d, m, y] = dmy.split('/');
                dateStr = `${y}-${m}-${d}T${hms}`;
              }

              const grossValue = parseInt(parts[5]?.replace(/"/g, '').replace(/,/g, '')) || 0;
              const netAmount = parseInt(parts[11]?.replace(/"/g, '').replace(/,/g, '')) || 0;

              const orderId = orderIdString || `SHP-${timestamp}-${index}`;
              newOrders.push({
                id: orderId,
                orderCode: orderIdString,
                customerName: 'Khách ShopeeFood',
                date: dateStr,
                channelName: 'ShopeeFood',
                items: [{ product: { name: 'Đơn hàng ShopeeFood', price: grossValue, recipe: [] }, quantity: 1 }],
                totalAmount: grossValue,
                netAmount: netAmount,
                status: 'Success',
                paymentStatus: 'Paid',
                paymentMethod: 'ShopeePay'
              });

              newTransactions.push({
                id: `TX-SHP-${timestamp}-${index}`,
                date: dateStr,
                type: 'Thu',
                amount: netAmount,
                accountId: 'ACC3', // Ví ShopeePay
                categoryId: 'FC1', 
                note: `Shopee Order: ${orderIdString}`,
                voucherCode: `PT-${orderId.slice(-6)}`,
                collector: 'System'
              });
            }
          });
        } else if (channel === 'Grab') {
          const lines = rawData.split('\n').filter(l => l.trim().length > 0 && !l.startsWith('Tên người bán'));
          lines.forEach((line, index) => {
            const parts = line.split(';');
            if (parts.length >= 50) {
              const orderCode = parts[15] || `GF-${timestamp}-${index}`;
              const rawDateStr = parts[4]; // 23 Mar 2026 11:04 PM
              
              // Standardize Grab date if possible (though it's usually already parseable)
              const dateStr = rawDateStr; 

              const grossValue = Math.abs(parseInt(parts[27])) || 0;
              const netAmount = parseInt(parts[51]) || 0;

              const orderId = orderCode || `GRB-${timestamp}-${index}`;
              newOrders.push({
                id: orderId,
                orderCode: orderCode,
                customerName: 'Khách GrabFood',
                date: dateStr,
                channelName: 'GrabFood',
                items: [{ product: { name: 'Đơn hàng GrabFood', price: grossValue, recipe: [] }, quantity: 1 }],
                totalAmount: grossValue,
                netAmount: netAmount,
                status: 'Success',
                paymentStatus: 'Paid',
                paymentMethod: 'GrabAccount'
              });

              newTransactions.push({
                id: `TX-GRB-${timestamp}-${index}`,
                date: dateStr,
                type: 'Thu',
                amount: netAmount,
                accountId: 'ACC4', // Ví GrabMerchant
                categoryId: 'FC1',
                note: `Grab Order: ${orderCode}`,
                voucherCode: `PT-${orderId.slice(-6)}`,
                collector: 'System'
              });
            }
          });
        }
        console.log(`[Import] Success: ${newOrders.length} orders created.`);
      } catch (err) {
        console.error("[Import] Error parsing CSV:", err);
      }

      return { 
        ...state, 
        posOrders: [...newOrders, ...state.posOrders], 
        transactions: [...newTransactions, ...state.transactions],
        accounts: state.accounts.map(acc => {
          const income = newTransactions.filter(t => t.accountId === acc.id).reduce((sum, t) => sum + t.amount, 0);
          return income > 0 ? { ...acc, balance: acc.balance + income } : acc;
        })
      };
    }

    case 'UPDATE_ORDER_STATUS': {
      return {
        ...state,
        posOrders: state.posOrders.map(o => o.id === action.payload.orderId ? { ...o, status: action.payload.status } : o)
      };
    }

    case 'DELETE_POS_ORDER': {
      const orderId = action.payload;
      const orderToDelete = state.posOrders.find(o => o.id === orderId);
      if (!orderToDelete) return state;

      let updatedIngredients = [...state.ingredients];
      
      // 1. Hoàn lại kho nếu đơn chưa bị hủy
      if (orderToDelete.status !== 'Cancelled' && orderToDelete.items) {
        orderToDelete.items.forEach(item => {
          const recipe = item.product?.recipe;
          if (recipe && recipe.length > 0) {
            updatedIngredients = updatedIngredients.map(ing => {
              const recipeItem = recipe.find(r => r.ingredientId === ing.id);
              if (recipeItem) {
                let change = (Number(recipeItem.qty) || 0) * (Number(item.quantity) || 0);
                if (recipeItem.unitMode === 'buy') change *= (Number(ing.conversionRate) || 1);
                if (recipeItem.unitMode === 'divide') change = (1 / (Number(recipeItem.qty) || 1)) * (Number(item.quantity) || 0);
                return { ...ing, stock: ing.stock + change }; // Hoàn trả: +
              }
              return ing;
            });
          }
        });
      }

      // 2. Xóa Giao dịch liên quan
      const relatedVoucherCode = `PT-${orderId.slice(-6)}`;
      const transactionsToRemove = state.transactions.filter(t => 
        t.voucherCode === relatedVoucherCode || 
        (orderToDelete.orderCode && t.note?.includes(orderToDelete.orderCode))
      );
      const newTransactions = state.transactions.filter(t => !transactionsToRemove.some(rt => rt.id === t.id));

      // 3. Hoàn lại tiền vào Tài khoản
      const newAccounts = state.accounts.map(acc => {
        const removedAmt = transactionsToRemove
          .filter(t => t.accountId === acc.id)
          .reduce((sum, t) => sum + (t.type === 'Thu' ? t.amount : -t.amount), 0);
        return { ...acc, balance: acc.balance - removedAmt };
      });

      return {
        ...state,
        posOrders: state.posOrders.filter(o => o.id !== orderId),
        ingredients: updatedIngredients,
        transactions: newTransactions,
        accounts: newAccounts
      };
    }

    case 'CLEAN_LEGACY_DATA': {
       const cleanNote = (note) => {
          if (!note) return note;
          return note
            .replace(/\[Import Shopee\] Order /g, 'Shopee Order: ')
            .replace(/\[Import Grab\] Order /g, 'Grab Order: ')
            .replace(/\[Import Shopee\] /g, 'Shopee Order: ')
            .replace(/\[Import Grab\] /g, 'Grab Order: ');
       };
       const cleanName = (name) => {
          if (!name) return name;
          return name.replace('Đơn ShopeeFood', 'Đơn hàng ShopeeFood').replace('Đơn GrabFood', 'Đơn hàng GrabFood');
       };

       return {
          ...state,
          transactions: state.transactions.map(t => ({ ...t, note: cleanNote(t.note) })),
          posOrders: state.posOrders.map(o => ({
             ...o,
             id: o.id.startsWith('IMP-') ? o.id.replace('IMP-', '') : o.id,
             items: o.items.map(item => ({
                ...item,
                product: { ...item.product, name: cleanName(item.product.name) }
             }))
          }))
       };
    }

    default: return state;
  }
};

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    try {
      const local = localStorage.getItem('omnipos_gaumuoi_v3');
      const parsed = local ? JSON.parse(local) : initial;
      // TRƯỜNG HỢP AUTO-IMPORT: Nếu thiếu Combo thì merge thêm từ initial vào parsed
      const mergedProducts = [...(parsed.products || [])];
      initial.products.forEach(p => {
         if (!mergedProducts.find(mp => mp.name === p.name)) {
            mergedProducts.push(p);
         }
      });
      const mergedIngredients = [...(parsed.ingredients || [])];
      initial.ingredients.forEach(i => {
         if (!mergedIngredients.find(mi => mi.name === i.name)) {
            mergedIngredients.push(i);
         }
      });

      return { ...initial, ...parsed, products: mergedProducts, ingredients: mergedIngredients };
    } catch {
      return initial;
    }
  });

  const [loading, setLoading] = useState(true);

  // Fetch from Firebase on initial load
  useEffect(() => {
    const fetchFromFirebase = async () => {
      try {
        const keys = Object.keys(initialState);
        const newState = {};
        for (const key of keys) {
          const docRef = doc(db, 'store_data', key);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            newState[key] = docSnap.data().data;
          }
        }
        if (Object.keys(newState).length > 0) {
           dispatch({ type: 'HYDRATE_STATE', payload: newState });
        }
      } catch (error) {
        console.error("Firebase fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFromFirebase();
  }, []);

  // Cleanup legacy data once (Migration V30)
  useEffect(() => {
    if (loading) return;
    const hasLegacy = state.transactions.some(t => t.note?.includes('[Import')) || 
                      state.posOrders.some(o => o.id?.startsWith('IMP-'));
    if (hasLegacy) {
       console.log("[Migration] Cleaning legacy import labels...");
       dispatch({ type: 'CLEAN_LEGACY_DATA' });
    }
  }, [loading, state.transactions, state.posOrders]);

  // Sync back to Firebase when state changes
  useEffect(() => {
    localStorage.setItem('omnipos_gaumuoi_v3', JSON.stringify(state));

    // Apply Theme
    document.documentElement.setAttribute('data-theme', state.settings?.theme || 'dark');

    if (loading) return;
    if (state.settings?.syncMode === 'manual') return; // Do not auto-sync if manual

    const syncToFirebase = async () => {
      try {
        const keys = Object.keys(state);
        for (const key of keys) {
           await setDoc(doc(db, 'store_data', key), { data: state[key] });
        }
      } catch (err) {
        console.error("Firebase sync error:", err);
      }
    };
    
    // Debounce 2.5s
    const handler = setTimeout(() => {
      syncToFirebase();
    }, 2500);

    return () => clearTimeout(handler);
  }, [state, loading]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', color: 'var(--primary)' }}>
        <h2>Đang đồng bộ dữ liệu với Đám Mây...</h2>
      </div>
    );
  }

  return <DataContext.Provider value={{ state, dispatch }}>{children}</DataContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => useContext(DataContext);
