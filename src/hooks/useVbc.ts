import { useMutation, useQuery } from '@tanstack/react-query';
import { createVbcCard, updateVbcCard, shareVbcCard, getVbcCard, deleteVbcCard } from '../api/vbc';
import { CreateVbcPayload, UpdateVbcPayload, ShareVbcPayload, VbcCard } from '../interfaces/vbcInterface';
import { useVbcStore } from '../store/vbc';
import { saveVBCIdToStorage, removeVBCFromStorage } from '../store/localStorage';

//Get VbcCard
export const useGetVbcCard = (id: string) => {
    const setVbcId = useVbcStore((state) => state.setVbcId);
    const setVbc = useVbcStore((state) => state.setVbc);

    const queryResult = useQuery<VbcCard, Error>({
        queryKey: ['vbc-card', id],
        queryFn: () => getVbcCard(id),
        enabled: !!id,
        retry: 1,
        refetchInterval: 10000,
    });

    if (queryResult.data) {
        console.log("VBC card fetched succesfully");
        saveVBCIdToStorage(queryResult.data.id);
        setVbcId(queryResult.data.id);
        setVbc(queryResult.data);
    }
    return queryResult;
};

//Get other VBC card
export const useGetOtherVbcCard = (id: string) => {
    const setVbcId = useVbcStore((state) => state.setVbcId);
    const setVbc = useVbcStore((state) => state.setVbc);

    const queryResult = useQuery<VbcCard, Error>({
        queryKey: ['vbc-card', id],
        queryFn: () => getVbcCard(id),
        enabled: !!id,
        retry: 1,
        refetchInterval: 10000,
    });

    if (queryResult.data) {
        
    }
    return queryResult;
};

// Create VBC Card
export const useCreateVbcCard = () => {
    const setVbcId = useVbcStore((state) => state.setVbcId);
    const setVbc = useVbcStore((state) => state.setVbc);
    
    return useMutation({
        mutationFn: (data: CreateVbcPayload) => createVbcCard(data),
        onSuccess: (res) => {
            saveVBCIdToStorage(res.id);
            setVbcId(res.id);
            setVbc(res);
        }
    });
};

// Update VBC Card
export const useUpdateVbcCard = () => {
    const setVbcId = useVbcStore((state) => state.setVbcId);
    const setVbc = useVbcStore((state) => state.setVbc);
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateVbcPayload }) =>
            updateVbcCard(id, data),
        onSuccess: (res) => {
            console.log("VBC card updated successfully");
            saveVBCIdToStorage(res.id);
            setVbcId(res.id);
            setVbc(res);
        }
    });
};

// Remove VBC Card
export const useDeleteVbcCard = () => {
  const resetVbc = useVbcStore((state) => state.clearVbc);

  return useMutation({
    mutationFn: (id: string) => deleteVbcCard(id),
    onSuccess: () => {
      removeVBCFromStorage({removeId: true});
      resetVbc();
    },
  });
};

// Share VBC Card
export const useShareVbcCard = () => {
    return useMutation({
        mutationFn: (data: ShareVbcPayload) => shareVbcCard(data),
    });
};
