let manageRoles = {
    updateUserPermissions: UserDocumentReference=>{
        UserDocumentReference.get().then(user=>{
            new Promise(resolve=>{
                // Delete the old permissions subcollection
                user.ref.collection('permissions').get().then(oldPermissions=>{
                    for (let i in oldPermissions.docs){
                        new Promise(nestedResolve=>{
                            oldPermissions.docs[i].ref.delete().then(nestedResolve);
                        })
                    }
                    resolve();
                });
            }).then(_=>{
                // Copy the current permissions to the subcollection
                user.get('role').get().then(role=>{
                    role.get('permissions').forEach(permissionRef=>{
                        permissionRef.get().then(permission=>{
                            user.ref.collection('permissions').add(permission.data())
                        });
                    });
                });
            });
        });
    },
};
export default manageRoles;
