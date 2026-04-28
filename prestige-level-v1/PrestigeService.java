package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.response.PrestigeResponse;

public interface PrestigeService {

    PrestigeResponse getPrestigeInfo(Long userId);

    PrestigeResponse addPrestige(Long userId, int amount, String reason);

    PrestigeResponse deductPrestige(Long userId, int amount, String reason);

    PrestigeResponse loginBonus(Long userId);

    PrestigeResponse checkPromotion(Long userId);
}