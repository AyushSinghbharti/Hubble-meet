// hooks/useRecommendations.ts
import { useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchUserProfile } from "@/src/api/profile";
import { dummyUserId } from "@/src/dummyData/dummyUserId";
import { useConnectionStore } from "@/src/store/connectionStore";

export const useRecommendations = () => {
  const addRecommendations = useConnectionStore((s) => s.addRecommendation);
  const setRecommendations = useConnectionStore((s) => s.setRecommendations);
  const clearRecommendations = useConnectionStore((s) => s.clearRecommendations);

  const profileQueries = useQueries({
    queries: dummyUserId.map((id) => ({
      queryKey: ["other-user-profile", id],
      queryFn: () => fetchUserProfile(id),
      enabled: !!id,
    })),
  });


  useEffect(() => {
    const allSettled = profileQueries.every(
      (q) => q.status === "success" || q.status === "error"
    );
    if (!allSettled) return;

    setRecommendations(profileQueries);
    const successfulProfiles = profileQueries
      .filter((q) => q.status === "success" && q.data)
      .map((q) => q.data);

    if (successfulProfiles.length > 0) {
      clearRecommendations();
      successfulProfiles.forEach((profile) => {
        addRecommendations(profile);
      });
    }
  }, [profileQueries]);
};
