import React, {useState} from "react"
import {Typography, Button, TextField, Grid, Paper, Divider, Switch} from "@mui/material"


function LoginRegister(props) {
    const [loginName, setLoginName] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState('')
    //State cho form đăng ký
    const [regLoginName, setRegLoginName] = useState('')
    const [regPassword, setRegPassword] = useState('')
    const [regFirstName, setRegFirstName] = useState('')
    const [regPasswordConfirm, setRegPasswordConfirm] = useState('')
    const [regLastName, setRegLastName] = useState('')
    const [regMessage, setRegMessage] = useState('')
    const [regLocation, setRegLocation] = useState('')
    const [regDescription, setRegDescription] = useState('')
    const [regOccupation, setRegOccupation] = useState('')
    //Xử lý đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault()
        try{
            const response = await fetch("https://w98c3h-8080.csb.app/admin/login", {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({login_name: loginName, password: password}),
                credentials: 'include'
            })
            const data = await response.json()
            if(!response.ok){
                setLoginError(data.error)
            }
            else{
                setLoginError('')
                props.setLoggedInUser(data)
            }
        }catch(err){
            setLoginError('Lỗi kết nối tới server')
        }
    }
    const handleRegister = async(e) => {
        e.preventDefault()
        if(regPassword != regPasswordConfirm){
            setRegMessage("Mật khẩu không khớp")
            return;
        }
        try{
            const response = await fetch('https://w98c3h-8080.csb.app/user', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},  
                body: JSON.stringify({
                    login_name: regLoginName, password: regPassword,
                    first_name: regFirstName, last_name: regLastName,
                    location: regLocation, description: regDescription, occupation: regOccupation
                })
            })
            const data = await response.json()
            if(!response.ok){
                setRegMessage(data.error)
            }
            else{
                setRegMessage("Đăng ký thành công, Bạn có thể đăng nhập")
                setRegLoginName(''); setRegPassword(''); setRegPasswordConfirm('');
                setRegFirstName(''); setRegLastName('');
                setRegLocation(''); setRegDescription(''); setRegOccupation('');
            }
        }catch(err){
            setRegMessage('Lỗi kết nối server')
        }
        
    }
    return (
        <Grid container spacing = {3} style={{padding: '20px'}}>
            {/*Form đăng nhập*/}
            <Grid item xs={12} sm={6}>
                <Paper style={{padding: '20px'}}>
                    <Typography variant='h5' gutterBottom>Đăng nhập</Typography>
                    <form onSubmit={handleLogin}>
                        <TextField fullWidth label="tên đăng nhập" margin='normal' value={loginName} 
                        onChange={(e) => setLoginName(e.target.value)}/>
                        <TextField fullWidth label="mật khẩu" type="password" value={password} 
                        onChange={(e) => setPassword(e.target.value)}/>
                        {loginError && <Typography color="error">{loginError}</Typography>}
                        <Button type="submit" variant="contained" color="primary" style={{marginTop: '16px'}}>Đăng nhập</Button>
                    </form>
                </Paper>
            </Grid>
            {/*Form đăng ký*/}
            <Grid item xs={12} sm={6}>
                <Paper style={{padding: '20px'}}>
                    <Typography variant='h5'gutterBottom>Đăng ký tài khoản mới</Typography>
                    <form onSubmit={handleRegister}>
                        <TextField fullWidth label="tên đăng nhập" margin="normal" required value={regLoginName} onChange={(e) => setRegLoginName(e.target.value)}/>
                        <TextField fullWidth label="họ" margin="normal" required value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)}/>
                        <TextField fullWidth label="tên" margin="normal" required value={regLastName} onChange={(e) => setRegLastName(e.target.value)}/>
                        <TextField fullWidth label="địa điểm (location)" margin="normal" value={regLocation} onChange={(e) => setRegLocation(e.target.value)}/>
                        <TextField fullWidth label="mô tả (description)" margin="normal" value={regDescription} onChange={(e) => setRegDescription(e.target.value)}/>
                        <TextField fullWidth label="nghề nghiệp (occupation)" margin="normal" value={regOccupation} onChange={(e) => setRegOccupation(e.target.value)}/>
                        <TextField fullWidth label="mật khẩu" margin="normal" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)}/>
                        <TextField fullWidth label="xác nhận mật khẩu" margin="normal" required value={regPasswordConfirm} onChange={(e) => setRegPasswordConfirm(e.target.value)}/>
                        {regMessage && <Typography color={regMessage.includes('thành công') ? 'primary' : 'error'}>{regMessage}</Typography>}
                        <Button type="submit" variant="contained" color="primary" style={{marginTop: '16px'}}>Đăng ký</Button>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    )
}
export default LoginRegister