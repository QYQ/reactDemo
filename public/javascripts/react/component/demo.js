var data = [
    {author: "Pete Hunt", text: "This is one comment"},
    {author: "Jordan Walke", text: "This is *another* comment"}
];

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

var CommentBox = React.createClass({//创建React组件

    //组件被挂载到DOM中的时候被调用，用来获取组件的初始state
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
        //�ύ�µ����۵�����������ˢ�µ�ǰ�����б����ʾ
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
    //�˷�������һ���������һ����Ⱦ��ʱ��React�Զ����õķ�����
    componentDidMount : function () {
        console.log("componentDidMount");
        //setInterval(this.loadCommentsFromServer, 2000);
    },
    render : function(){
        console.log("CommentBox render");
        return (
            <div className = "commentBox">
                <h1>Comments</h1>
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
        e.preventDefault();//��ֹ�����Ĭ�ϱ�����
        var name = this.refs.name.value;
        var text = this.refs.text.value;
        console.log(this.refs.name);
        if(!name || !text){
            return;
        }
        //�ύ���ۣ�ˢ�������б�
        this.props.onCommentSubmit({name:name,text:text});
        //��ձ�����state����
        this.setState({name:"",text:""});
    },
    render : function () {
        console.log("CommentForm render");
        return (
            <form className = "commentForm" onSubmit={this.handleSubmit}>
                <input type = "text" placeholder = {this.state.name} ref="name"></input>
                <input type = "text" placeholder = {this.state.text} ref="text"></input>
                <input type = "submit" value = "Post"></input>
            </form>
        );
    }
});



//��Ⱦ
ReactDOM.render(
    <CommentBox url="/api/comments"/>,
    document.getElementById("content")
);