import { IUserProfile } from "@/interfaces/UserInterface";

export interface AppNotification {
    content: string;
    color?: string;
    showProgress?: boolean;
}

export interface MainState {
    token: string;
    isLoggedIn: boolean | null;
    logInError: boolean;
    userProfile: IUserProfile | null;
    dashboardMiniDrawer: boolean;
    dashboardShowDrawer: boolean;
    notifications: AppNotification[];
}
