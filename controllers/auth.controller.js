exports.getLogin=(req,res)=>{
    res.render("./store/login-page");
};

exports.postLogin=(req,res)=>{
    req.session.isLoggedIn=true;
    
    const username=req.body.username;
    req.session.user=username;

    res.redirect('/');
};

exports.postLogout=(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    });
};