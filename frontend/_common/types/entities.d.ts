export {};

declare global {
  namespace Entity {
    interface ApiResponse<DataType> {
      success: boolean;
      data: DataType;
      error: string | null;
    }

    interface User {
      id: string;
      email: string;
      displayName: string;
      avatarUrl: string | null;
      createdAt: string;
      updatedAt: string;
    }

    interface PaginatedResponse<ItemType> {
      items: ItemType[];
      totalCount: number;
      pageSize: number;
      currentPage: number;
      totalPages: number;
    }
  }
}
