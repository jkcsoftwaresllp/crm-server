class BaseSeeder {
  constructor() {
    if (this.constructor === BaseSeeder) {
      throw new Error('BaseSeeder cannot be instantiated directly');
    }
  }

  async run(connection) {
    throw new Error('run method must be implemented by subclasses');
  }

  async clear(connection) {
    throw new Error('clear method must be implemented by subclasses');
  }

  getName() {
    return this.constructor.name;
  }
}

export default BaseSeeder;
