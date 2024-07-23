import { User } from "../models/user";
import { faker } from "@faker-js/faker";

const createUser = async (numUsers: number) => {
  try {
    const userPromises = [];
    for (let i = 0; i < numUsers; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        password: "123456",
      });
      userPromises.push(tempUser);
    }
    await Promise.all(userPromises);
    console.log("Users created successfully", numUsers);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(1);
  }
};

export default createUser;
