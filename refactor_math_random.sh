#!/bin/bash

# Fichiers à refactoriser
files=(
  "src/application/usecases/BattleUseCase.ts"
  "src/application/usecases/UseItemUseCase.ts"
  "src/application/usecases/AttackUseCase.ts"
  "src/application/usecases/LeagueUseCase.ts"
  "src/application/usecases/RewardsUseCase.ts"
  "src/domain/services/BattleSimulator.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Traitement de $file..."
    
    # Remplacer Math.floor(Math.random() * X) par randomGenerator.generateInRange(0, X-1)
    # Note: Ce remplacement est complexe, on le fait manuellement après
    
    # Remplacer Math.random() < X par randomGenerator.chance(X)
    sed -i '' 's/Math\.random() < \([0-9.]*\)/this.randomGenerator.chance(\1)/g' "$file"
    sed -i '' 's/Math\.random() > \([0-9.]*\)/!this.randomGenerator.chance(\1)/g' "$file"
    
    # Remplacer Math.floor( par mathService.floor(
    sed -i '' 's/Math\.floor(/this.mathService.floor(/g' "$file"
    
    echo "$file traité ✓"
  fi
done

echo "Refactorisation automatique terminée !"
echo "⚠️  Vérifiez manuellement les fichiers pour les cas complexes"
