
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axiosInstance from "axios";

const Table = () => {
    let emptyUser = {
        id:"",
        name: '',
        phone : '',
        email: '',
       hobbies:'',
        
    };
    

    const [Users, setUsers] = useState([]);
    const [UserDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [User, setUser] = useState(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const [isEdit ,setIsEdit]=useState(false);
    useEffect(() => {
        const getUser = async () => {
       
       try {
        const resp = await axiosInstance.get("https://user-management-api-d0pq.onrender.com/allusers")
        resp.data.map((value,indx)=>{
                value["id"]=indx+1;
        })
        setUsers(resp.data);
        console.log(resp.data);
        

       } catch (error) {
        console.log(error);
       }
    }
    getUser();
      }, [UserDialog,deleteUserDialog]);
    

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    }

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    }

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    }

    const saveUser =async (data) => {

        setSubmitted(true);
            data.preventDefault();
            if(isEdit){
                console.log(data);
                try {
                    const resp = await axiosInstance.put(`https://user-management-api-d0pq.onrender.com/updateuser/${User._id}`,User)
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
        
                   console.log(resp);
                   setUserDialog(resp);
                   } catch (error) {
                    console.log(error);
                   }
                   setIsEdit(false);
            }
            else{
                try {
                    const resp = await axiosInstance.post("https://user-management-api-d0pq.onrender.com/saveuser",
                    User)
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User save successfully', life: 3000 });
    
                    console.log(resp.data);
                    
                   } catch (error) {
                    console.log(error);
                   }
            }
            // const {name,email,phone,hobbies}=user

               
            setUserDialog(false);
            // setUser(emptyUser);
        }
        
    

    const editUser =async(user) => {
        setUser({...user});
        setUserDialog(true);
        setIsEdit(true);
       
       
    }
    const sendMail =async() =>{
        try {
            const resp = await axiosInstance.post("https://user-management-api-d0pq.onrender.com/sendmail",selectedUsers)
            console.log(resp);
            if(resp){
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'email sent successfully', life: 3000 });
  
            }
        } catch (error) {
           console.log(error); 
        }
        console.log(selectedUsers)
    }

    const confirmDeleteUser = (User) => {
        setUser(User);
        setDeleteUserDialog(true);
    }

    const deleteUser = async() => {
        let _Users = Users.filter(val => val.id !== User.id);
        console.log(_Users);
        try {
            const resp = await axiosInstance.delete(`https://user-management-api-d0pq.onrender.com/deleteuser/${User._id}`)
        } catch (error) {
            console.log(error)
        }
        
        setDeleteUserDialog(false);
        setUser(emptyUser);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    }
    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    }

    const deleteSelectedUsers = () => {
        let _Users = Users.filter(val => !selectedUsers.includes(val));
        setUsers(_Users);
        setDeleteUsersDialog(false);
        setSelectedUsers(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _User = {...User};
        _User[`${name}`] = val;

        setUser(_User);
    }


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label=" New User" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label=" Share" icon="pi pi-upload" className="p-button-help "style={{marginLeft:"10px"}}  onClick={sendMail} />

            </React.Fragment>
        )
    }
    
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteUser(rowData)} />
            </React.Fragment>
        );
    }

    const UserDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveUser} />
        </React.Fragment>
    );
    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteUser} />
        </React.Fragment>
    );
    const deleteUsersDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUsersDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedUsers} />
        </React.Fragment>
    );

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>

                <DataTable ref={dt} value={Users} selection={selectedUsers} onSelectionChange={(e) => setSelectedUsers(e.value)}
                    dataKey="id" >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} ></Column>
                    <Column field="id" header="id" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="phone" header="Phone number"  sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="email" header="Email" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="hobbies" header="Hobbies"  sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} header="Action" style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>
            <Dialog visible={UserDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid" footer={UserDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <InputText id="name" value={User.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !User.name })} />
                    {submitted && !User.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="phone">Phone number</label>
                    <InputText id="phone" value={User.phone} onChange={(e) => onInputChange(e, 'phone')} required rows={3} cols={20} />
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={User.email} onChange={(e) => onInputChange(e, 'email')} required rows={3} cols={20} />
                </div>
                <div className="field">
                    <label htmlFor="hobbies">Hobbies</label>
                    <InputText id="hobbies" value={User.hobbies} onChange={(e) => onInputChange(e, 'hobbies')} required rows={3} cols={20} />
                </div>
               
            </Dialog>

            <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {User && <span>Are you sure you want to delete <b>{User.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {User && <span>Are you sure you want to delete the selected Users?</span>}
                </div>
            </Dialog>
        </div>
    );
}
export default Table;
                 