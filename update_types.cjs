const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf-8');

if (!code.includes('trainingsAvailable?: number;')) {
  code = code.replace(
    '  statPointsAvailable: number;',
    '  statPointsAvailable: number;\n  trainingsAvailable?: number;'
  );
  fs.writeFileSync('src/types.ts', code);
}
