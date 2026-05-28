export const getAnimalProfile = (result) => ({
  title: result?.creature ?? 'Meme Animal',
  description: result?.animal_vibe ?? 'same chaotic animal frequency',
  tags: [
    result?.rarity ?? 'Common',
    `${result?.animal_score ?? result?.npc_score ?? 0}% match`,
    `${result?.braincells ?? 1} braincells`,
  ],
})
