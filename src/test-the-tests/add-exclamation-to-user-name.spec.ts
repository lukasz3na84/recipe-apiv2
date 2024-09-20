import { addExclamationToUserName } from './add-exclamation-to-user-name';

//describe - grupowanie testów

describe('addExclamationToUserName', () => {
  let user;

  beforeEach(() => {
    //  Arrange:
    user = { name: 'Michał' };
  });

  it('should add exclamation to name', () => {
    // Act:
    const endUser = addExclamationToUserName(user);

    // Assert:
    expect(endUser.name).toBe('Michał!');
  });

  it('should not mutate given object', () => {
    //  Arrange:
    const user = { name: 'Michał' };

    // Act:
    const endUser = addExclamationToUserName(user);

    // Assert:
    expect(endUser).not.toBe(user);
  });
});
