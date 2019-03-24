let manageRoles = {
  updateUserPermissions: UserDocumentReference=>{
    // Returns a promise to synchronize execution.
    return UserDocumentReference.get().then(user=>{
      // Delete the old permissions subcollection
      return user.ref.collection('permissions').get().then(oldPermissions=>{
        let promises = [];
        for (let i in oldPermissions.docs){
          promises.push(new Promise(nestedResolve=>{
            oldPermissions.docs[i].ref.delete().then(nestedResolve);
          }));
        }
        return Promise.all(promises);
      }).then(_=>user.get('role').get())
      .then(role=>{
        // Add the latest version of permissions to the user.
        let permissions = role.get('permissions');
        let promises = [];
        for (let i in permissions){
          promises.push(new Promise(nestedResolve=>{
            permissions[i].get().then(permission=>{
              return user.ref.collection('permissions').add(permission.data())
            }).then(nestedResolve);
          }));
        }
        return Promise.all(promises);
      });
    });
  },
};
export default manageRoles;
