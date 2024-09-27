import { UsersService } from './users.service';

describe('UsersService', () => {
  // createUser method creates a new user with given name, email and password
  it('should create a new user with given name, email and password', async () => {
    const userRepositoryMock = {
      create: jest.fn().mockResolvedValue({}),
    };
    // @ts-ignore
    const usersService = new UsersService(userRepositoryMock);
    const createUserDto = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    };
    await usersService.createUser(createUserDto);
    expect(userRepositoryMock.create).toHaveBeenCalledWith(
      createUserDto,
    );
  });

  // createAdmin method creates a new user with given name, email, password, role=admin
  it('should create a new admin with given name, email, password, role=admin', async () => {
    const userRepositoryMock = {
      create: jest.fn().mockResolvedValue({}),
    };
    // @ts-ignore
    const usersService = new UsersService(userRepositoryMock);
    const createUserDto = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    };
    await usersService.createAdmin(createUserDto);
    expect(userRepositoryMock.create).toHaveBeenCalledWith({
      ...createUserDto,
      role: 'admin',
    });
  });

  // getAllUsers method returns all users with role=user
  it('should return all users with role=user', async () => {
    const userRepositoryMock = {
      find: jest
        .fn()
        .mockResolvedValue([{ role: 'user' }, { role: 'user' }]),
    };

    // @ts-ignore
    const usersService = new UsersService(userRepositoryMock);
    // @ts-ignore
    const users = await usersService.getAllUsers();
    expect(userRepositoryMock.find).toHaveBeenCalled();
    expect(users).toBeDefined();
  });

  // updateUser method updates user with given id and data
  it('should update a user with given id and data', async () => {
    const userRepositoryMock = {
      findByIdAndUpdate: jest.fn().mockResolvedValue({}),
    };
    // @ts-ignore
    const usersService = new UsersService(userRepositoryMock);
    const userId = '123456789';
    const userData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    };
    await usersService.updateUser(userId, userData);
    expect(userRepositoryMock.findByIdAndUpdate).toHaveBeenCalledWith(
      userId,
      userData,
      { new: true },
    );
  });

  // getAdmins method returns all users with role=admin
  it('should return all users with role=admin when getAdmins method is called', async () => {
    const userRepositoryMock = {
      find: jest
        .fn()
        .mockResolvedValue([{ role: 'admin' }, { role: 'admin' }]),
    };
    // @ts-ignore
    const usersService = new UsersService(userRepositoryMock);
    const request = {
      query: {
        skip: 0,
        limit: 10,
      },
    };
    const admins = await usersService.getAdmins(request);
    expect(admins).toBeDefined(); // should return an array of admins
    expect(userRepositoryMock.find).toHaveBeenCalled();
  });

  // deleteUser method deletes user with given id
  it('should delete user when given id', async () => {
    // Arrange
    const userRepositoryMock = {
      findByIdAndDelete: jest.fn().mockResolvedValue({}),
    };
    // @ts-ignore
    const usersService = new UsersService(userRepositoryMock);
    const userId = '123456789';

    // Act
    await usersService.deleteUser(userId);

    // Assert
    expect(userRepositoryMock.findByIdAndDelete).toHaveBeenCalledWith(
      userId,
    );
  });

  // getUserById method returns user with given id
  it('should return the user with the given id', async () => {
    // Arrange
    const userId = '1234567890';
    const userMock = {
      _id: userId,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    };
    const userRepositoryMock = {
      findOne: jest.fn().mockResolvedValue(userMock),
    };
    // @ts-ignore
    const usersService = new UsersService(userRepositoryMock);

    // Act
    const result = await usersService.getUserById(userId);

    // Assert
    expect(result).toEqual(userMock);
  });

  // Should return the user object when a valid email is provided
  it('should return the user object when a valid email is provided', async () => {
    // Arrange
    const email = 'validemail@example.com';
    const user = {
      name: 'John Doe',
      email: 'validemail@example.com',
      password: 'password',
    };
    const userRepository = {
      findOne: jest.fn().mockResolvedValue(user),
    };
    // @ts-ignore
    const usersService = new UsersService(userRepository);

    // Act
    const result = await usersService.getUserByEmail(email);

    // Assert
    expect(result).toEqual(user);
    expect(userRepository.findOne).toHaveBeenCalledWith({ email });
  });
});
