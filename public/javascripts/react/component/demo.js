//单条评论
var Comment = React.createClass({
    render : function () {
        console.log("Comment render");
        return (
            <div className = "comment">
                <h2 className = "commentAuthor">
                    {this.props.author}
                </h2>
                {this.props.children}
            </div>
        );
    }
});

//整个评论框
var CommentBox = React.createClass({//创建React组件

    //组件生命周期方法，组件被挂载到DOM中的时候被调用，用来获取组件的初始state
    getInitialState : function () {
        console.log("getInitialState");
        return {data:[]}
    },
    loadCommentsFromServer : function () {
        console.log("loadCommentsFromServer");
        $.ajax({
            url : this.props.url,
            dataType : 'json',
            cache : false,
            success : function (data) {
                //调用setState()方法，React会自动根据state的改变计算DOM的差异，然后渲染
                this.setState({data:data});
            }.bind(this),
            error : function (xhr, status, err) {
                console.log("请求失败" + this.props.url);
            }.bind(this)
        });
    },
    handleCommentSubmit : function (newComment) {
        //处理评论提交操作，上传新评论到服务器，并更新显示
        console.log("ajax to commit new comment");
        $.ajax({
            url : this.props.url,
            dateType : "json",
            type : "POST",
            data : newComment,
            success : function (data) {
                this.setState({data : data});
            }.bind(this),
            error : function (xhr, status, err) {
                console.log("commit new comment fail");
            }.bind(this)
        });
    },
    //生命周期方法，组件被挂载到了DOM中之后立即被调用
    componentDidMount : function () {
        console.log("componentDidMount");
        //setInterval(this.loadCommentsFromServer, 2000);
    },
    //需要渲染时这行这个方法，返回一个当前组件的描述，不是真正的DOM
    render : function(){
        console.log("CommentBox render");
        return (
            <div className = "commentBox">
                <h1>评论</h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
            </div>
        );
    }
});

var CommentList = React.createClass({
    render : function () {
        console.log("CommentList render");
        var commentNodes = this.props.data.map(function (comment) {
            return (
                <Comment author={comment.author}>
                    {comment.text}
                </Comment>
            );
        });
        return (
            <div className = "commentList">
                {commentNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    getInitialState : function () {
        return {name:"",text:""};
    },
    handleSubmit : function (e) {
        console.log("on submit click");
        e.preventDefault();//阻止浏览器默认表单提交事件处理
        var name = this.refs.name.value;
        var text = this.refs.text.value;
        if(!name || !text){
            return;
        }
        //提交评论
        this.props.onCommentSubmit({name:name,text:text});
        //清空输入框
        this.refs.name.value = "";
        this.refs.text.value = "";
    },
    render : function () {
        console.log("CommentForm render");
        return (
            <form className = "commentForm" onSubmit={this.handleSubmit}>
                <input type = "text"  ref="name" ></input>
                <input type = "text"  ref="text" ></input>
                <input type = "submit" value = "评论"></input>
            </form>
        );
    }
});



//渲染组件
ReactDOM.render(
    <CommentBox url="/api/comments"/>,
    document.getElementById("content")
);