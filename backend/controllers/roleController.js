import Role from '../models/roleModel.js';

const createRoles = async () => {
    const rolesData = [
      { name: 'admin' },
      { name: 'member' },
      { name: 'guest' },
      // Add other roles as neededrs
    ];
  
    try {
      // Insert roles into the 'roles' collection
      const createdRoles = await Role.insertMany(rolesData);
      console.log('Roles created:', createdRoles);
    } catch (error) {
      console.error('Error creating roles:', error.message);
    }
  };

  const findRoles = async (req, res) => {
    try {
        const data = await Role.find()
        return res.send(data)
    } catch (error) {
        return res.send(error)
    }
}

export {findRoles}
  export default createRoles