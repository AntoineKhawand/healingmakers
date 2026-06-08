import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zip: string;
}

interface ProfileStore {
  profile: ProfileData;
  saved: boolean;
  saveProfile: (data: ProfileData) => void;
  clearProfile: () => void;
}

const EMPTY: ProfileData = {
  fullName: "", email: "", phone: "",
  address: "", city: "", country: "", zip: "",
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: EMPTY,
      saved: false,
      saveProfile: (data) => set({ profile: data, saved: true }),
      clearProfile: () => set({ profile: EMPTY, saved: false }),
    }),
    { name: "hm-profile" }
  )
);
