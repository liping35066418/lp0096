export interface Flower {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
}

export interface OrderItem {
  flowerId: string;
  flowerName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNo: string;
  createdAt: string;
  items: OrderItem[];
  totalAmount: number;
  totalQuantity: number;
}

export const flowers: Flower[] = [
  { id: 'F001', name: '红玫瑰', category: '玫瑰', unitPrice: 12 },
  { id: 'F002', name: '粉玫瑰', category: '玫瑰', unitPrice: 10 },
  { id: 'F003', name: '白玫瑰', category: '玫瑰', unitPrice: 11 },
  { id: 'F004', name: '百合', category: '百合', unitPrice: 15 },
  { id: 'F005', name: '向日葵', category: '向日葵', unitPrice: 8 },
  { id: 'F006', name: '康乃馨', category: '康乃馨', unitPrice: 6 },
  { id: 'F007', name: '郁金香', category: '郁金香', unitPrice: 14 },
  { id: 'F008', name: '满天星', category: '配花', unitPrice: 5 },
  { id: 'F009', name: '勿忘我', category: '配花', unitPrice: 7 },
  { id: 'F010', name: '洋桔梗', category: '桔梗', unitPrice: 13 },
];
