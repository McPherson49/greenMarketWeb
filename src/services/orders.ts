// api/orders.ts
import ApiFetcher from "@/utils/apis";
import { toast } from "react-toastify";
import { GetOrdersRequest, GetOrdersResponse, Order } from "../types/orders";

// GET ALL ORDERS (with optional parameters)
export const getOrders = async (
  params?: GetOrdersRequest
): Promise<GetOrdersResponse | null> => {
  try {
    const response = await ApiFetcher.get<GetOrdersResponse>(`/orders`, {
      params: params || {}
    });

    if (response?.data) {
      return response.data; 
    }

    toast.error("Failed to load orders");
    return null;
  } catch (error) {
    console.error("Error fetching orders:", error);
    toast.error("Error fetching orders");
    return null;
  }
};

// GET SINGLE ORDER
export const getOrder = async (orderId: string): Promise<Order | null> => {
  try {
    const response = await ApiFetcher.get<{ data: Order }>(`/orders/${orderId}`);
    
    if (response?.data?.data) {
      return response.data.data;
    }
    
    toast.error("Failed to load order details");
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    toast.error("Error fetching order");
    return null;
  }
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (
  orderId: string, 
  status: string
): Promise<Order | null> => {
  try {
    const response = await ApiFetcher.patch<{ data: Order }>(
      `/orders/${orderId}/status`,
      { status }
    );
    
    if (response?.data?.data) {
      toast.success("Order status updated successfully");
      return response.data.data;
    }
    
    toast.error("Failed to update order status");
    return null;
  } catch (error) {
    console.error("Error updating order status:", error);
    toast.error("Error updating order status");
    return null;
  }
};

// EXPORT ORDERS (if needed)
export const exportOrders = async (params?: GetOrdersRequest): Promise<void> => {
  try {
    const response = await ApiFetcher.get(`/orders/export`, {
      params: params || {},
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    toast.success("Orders exported successfully");
  } catch (error) {
    console.error("Error exporting orders:", error);
    toast.error("Error exporting orders");
  }
};