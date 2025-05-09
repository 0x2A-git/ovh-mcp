import eslint from '@eslint/js'
import { globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    globalIgnores(['dist/*', 'tests/*']),
    {
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
        },
    }
)
