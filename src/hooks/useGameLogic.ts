import { useState, useMemo, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/client";
import type { ClothingCollection } from "../type";

export const useGameLogic = (tops: ClothingCollection, bottoms: ClothingCollection) => {
  const [selectedSkin, setSelectedSkin] = useState<"dark" | "light">("dark");
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const { user } = useContext(AuthContext);

  useEffect(() => {
    setCurrentTopIndex(0);
    setCurrentBottomIndex(0);
  }, [selectedSkin]);

  const currentTopsArray = useMemo(() => tops[selectedSkin], [tops, selectedSkin]);
  const currentBottomsArray = useMemo(() => bottoms[selectedSkin], [bottoms, selectedSkin]);

  const currentTop = currentTopsArray[currentTopIndex];
  const currentBottom = currentBottomsArray[currentBottomIndex];

  const handleSaveOutfit = async () => {
    if (!user || !currentTop || !currentBottom) return;

    setSaveStatus("saving");
    try {
      await apiClient.post("/outfits", {
        username: user.username,
        top_id: currentTop.id || currentTop.name,
        bottom_id: currentBottom.id || currentBottom.name,
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const nextTop = () => setCurrentTopIndex((i) => (i + 1) % currentTopsArray.length);
  const prevTop = () => setCurrentTopIndex((i) => (i - 1 + currentTopsArray.length) % currentTopsArray.length);
  const nextBottom = () => setCurrentBottomIndex((i) => (i + 1) % currentBottomsArray.length);
  const prevBottom = () => setCurrentBottomIndex((i) => (i - 1 + currentBottomsArray.length) % currentBottomsArray.length);

  return {
    selectedSkin,
    setSelectedSkin,
    currentTop,
    currentBottom,
    saveStatus,
    user,
    handlers: { nextTop, prevTop, nextBottom, prevBottom, handleSaveOutfit }
  };
};