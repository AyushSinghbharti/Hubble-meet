import { useMutation } from '@tanstack/react-query';
import { createVbcCard, updateVbcCard, shareVbcCard } from '../api/vbc';
import { CreateVbcPayload, UpdateVbcPayload, ShareVbcPayload } from '../interfaces/vbcInterface';

// Create VBC Card
export const useCreateVbcCard = () => {
    return useMutation({
        mutationFn: (data: CreateVbcPayload) => createVbcCard(data),
    });
};

// Update VBC Card
export const useUpdateVbcCard = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateVbcPayload }) =>
            updateVbcCard(id, data),
    });
};

// Share VBC Card
export const useShareVbcCard = () => {
    return useMutation({
        mutationFn: (data: ShareVbcPayload) => shareVbcCard(data),
    });
};
