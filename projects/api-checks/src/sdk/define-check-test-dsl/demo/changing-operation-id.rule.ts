import { check } from '../define-check';
import { scenario } from '../scenarios';

const changingOperationIdRule = check('operationId should not change')
  .description('')
  .implementation(({ operations }) => {
    const { expect } = require('chai');
    operations.removed.must('not be removed unless marked deprecated', () => {
      expect.fail('operations can not be removed');
    });
  })
  .passingExample(
    scenario('updating description for GET /example').operation.changed(
      {
        operationId: '123',
        responses: {
          200: {
            description: 'abc',
          },
        },
      },
      (original) => {
        original.description = 'CHANGED IT';
        return original;
      }
    )
  )
  .failingExample(
    scenario('removing').operation.removed({
      responses: {},
    })
  );