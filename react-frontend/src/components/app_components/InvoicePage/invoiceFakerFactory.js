
import { faker } from "@faker-js/faker";
export default (user,count,customerIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
name: faker.lorem.sentence(""),
customer: customerIds[i % customerIds.length],
subtotal: faker.lorem.sentence(""),
totalamount: faker.lorem.sentence(""),
discount: faker.lorem.sentence(""),
delivery: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
