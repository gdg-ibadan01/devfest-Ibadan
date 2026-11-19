'use client';

import { useCallback, useState } from 'react';
import {
  useDeleteCampaignAsset,
  useUploadCampaignAsset,
} from '@/app/_module/services/emails.service';
import { showToast } from '@/app/_module/lib/notify';
import type { EmailAssetDto, EmailAssetKind } from '@/app/_module/api/types';
import { checkFile } from './assetLimits';

/**
 * Holds a draft's images and attachments. Uploading needs a saved draft, so the
 * caller passes `ensureSaved`, which saves the draft first and returns its id.
 */
export function useCampaignAssets(
  initial: EmailAssetDto[] | undefined,
  ensureSaved: () => Promise<string | undefined>
) {
  const [assets, setAssets] = useState<EmailAssetDto[]>(initial ?? []);
  const upload = useUploadCampaignAsset();
  const remove = useDeleteCampaignAsset();
  const [busyCount, setBusyCount] = useState(0);

  const attachments = assets.filter((a) => a.kind === 'ATTACHMENT');
  const images = assets.filter((a) => a.kind === 'INLINE_IMAGE');

  const add = useCallback(
    async (files: File[], kind: EmailAssetKind): Promise<EmailAssetDto[]> => {
      if (files.length === 0) return [];
      const added: EmailAssetDto[] = [];
      setBusyCount((n) => n + 1);
      try {
        const id = await ensureSaved();
        if (!id) return [];
        // Upload one at a time so the limits are checked against what is really stored.
        let current = assets.filter((a) => a.kind === kind);
        for (const file of files) {
          const problem = checkFile(file, kind, current);
          if (problem) {
            showToast.error(problem);
            continue;
          }
          try {
            const asset = await upload.mutateAsync({ id, file, kind });
            added.push(asset);
            current = [...current, asset];
            setAssets((all) => [...all, asset]);
          } catch {
            // the mutation already showed the error
          }
        }
      } finally {
        setBusyCount((n) => n - 1);
      }
      return added;
    },
    [assets, ensureSaved, upload]
  );

  const removeAsset = useCallback(
    async (asset: EmailAssetDto, campaignId: string | undefined) => {
      if (!campaignId) return;
      await remove.mutateAsync({ id: campaignId, assetId: asset.id });
      setAssets((all) => all.filter((a) => a.id !== asset.id));
    },
    [remove]
  );

  return {
    assets,
    attachments,
    images,
    add,
    removeAsset,
    uploading: busyCount > 0,
    removing: remove.isPending,
  };
}
