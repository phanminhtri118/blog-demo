import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UIState {
  theme: "light" | "dark" | "system";
  isMobileMenuOpen: boolean;
  activeModal: string | null;
  notifications: Notification[];
  globalLoading: boolean;
  isSidebarCollapsed: boolean;
}

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  timestamp: number;
}

interface UIActions {
  setTheme: (theme: UIState["theme"]) => void;
  toggleTheme: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setGlobalLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

type UIStore = UIState & UIActions;

const initialState: UIState = {
  theme: "system",
  isMobileMenuOpen: false,
  activeModal: null,
  notifications: [],
  globalLoading: false,
  isSidebarCollapsed: false,
};

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setTheme: (theme: UIState["theme"]) => set({ theme }),
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === "light" ? "dark" : "light";
        set({ theme: newTheme });
      },
      toggleMobileMenu: () => {
        const { isMobileMenuOpen } = get();
        set({ isMobileMenuOpen: !isMobileMenuOpen });
      },
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      openModal: (modalId: string) => set({ activeModal: modalId }),
      closeModal: () => set({ activeModal: null }),
      addNotification: (notification: Omit<Notification, "id" | "timestamp">) => {
        const { notifications } = get();
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substring(2, 11),
          timestamp: Date.now(),
        };

        set({ notifications: [...notifications, newNotification] });

        const duration = notification.duration ?? 5000;
        if (duration > 0) {
          setTimeout(() => {
            get().removeNotification(newNotification.id);
          }, duration);
        }
      },
      removeNotification: (id: string) => {
        const { notifications } = get();
        set({ notifications: notifications.filter((n) => n.id !== id) });
      },
      clearNotifications: () => set({ notifications: [] }),
      setGlobalLoading: (loading: boolean) => set({ globalLoading: loading }),
      toggleSidebar: () => {
        const { isSidebarCollapsed } = get();
        set({ isSidebarCollapsed: !isSidebarCollapsed });
      },
      setSidebarCollapsed: (collapsed: boolean) => set({ isSidebarCollapsed: collapsed }),
    }),
    {
      name: "ui-store",
    }
  )
);

export const useTheme = () => useUIStore((state) => state.theme);
export const useNotifications = () => useUIStore((state) => state.notifications);
export const useGlobalLoading = () => useUIStore((state) => state.globalLoading);
