import React from "react";
import { Order } from "@/data/mockData";

interface Props {
  orders: Order[];
  getStatusColor: (status: string) => string;
}

const OrdersTab: React.FC<Props> = ({ orders, getStatusColor }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 border rounded-lg flex justify-between"
          >
            <div>
              <p className="font-semibold">{order.product}</p>
              <p className="text-sm text-gray-500">{order.customerName}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersTab;
