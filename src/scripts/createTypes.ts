import * as path from 'path'
import { generateNamespace } from '@gql2ts/from-schema'
import * as fs from 'fs'

import { genSchema } from '../utils/generateSchema'

const typescriptTypes = generateNamespace('GQL', genSchema())

fs.writeFile(
    path.join(__dirname, '../types/schema.d.ts'),
    typescriptTypes,
    err => {
        err
            ? console.log('🤷‍♂️', err)
            : console.log('✨  types have been updated ! ✍️')
    }
)
