'use strict';
var ejs = require('ejs');
var heredoc = require('heredoc');

var getReplyData = function(message, replyContent) {
    var info = {};
    var type = 'text';
    var fromUsername = message.FromUserName;
    var toUsername = message.ToUserName;
    if(Array.isArray(replyContent)) {
        type='news';
    }
    type = replyContent.type || type;

    info.toUsername = fromUsername;
    info.fromUsername = toUsername;
    info.createTime = new Date().getTime();
    info.msgType = type;
    info.content = replyContent;
    return info;
};

var tpl = heredoc(function(){/*
    <xml>
    <ToUserName><![CDATA[<%= toUsername %>]]></ToUserName>
    <FromUserName><![CDATA[<%= fromUsername %>]]></FromUserName>
    <CreateTime><%= createTime %></CreateTime>
    <MsgType><![CDATA[<%= msgType %>]]></MsgType>
    <% if(msgType === 'text'){ %>
        <Content><![CDATA[<%= content %>]]></Content>
    <% } else if (msgType === 'image') { %>
        <Image>
        <MediaId><![CDATA[<%= content.media_id %>]]></MediaId>
        </Image>
    <% } else if (msgType === 'voice') { %>
        <Voice>
        <MediaId><![CDATA[<%= content.media_id %>]]></MediaId>
        </Voice>
    <% } else if (msgType === 'video') { %>
        <Video>
        <MediaId><![CDATA[<%= content.media_id %>]]></MediaId>
        <Title><![CDATA[<%= tcontent.itle %>]]></Title>
        <Description><![CDATA[<%= content.description %>]]></Description>
        </Video> 
    <% } else if (msgType === 'music') { %>
        <Music>
        <Title><![CDATA[<%= content.TITLE %>]]></Title>
        <Description><![CDATA[<%= content.DESCRIPTION %>]]></Description>
        <MusicUrl><![CDATA[<%= content.MUSIC_Url %>]]></MusicUrl>
        <HQMusicUrl><![CDATA[<%= content.HQ_MUSIC_Url %>]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[<%= content.media_id %>]]></ThumbMediaId>
        </Music>
    <% } else if (msgType === 'news') { %>
        <ArticleCount><%= content.length %></ArticleCount>
        <Articles>
        <% content.forEach(function(item){ %>
        <item>
        <Title><![CDATA[<%= item.title %>]]></Title> 
        <Description><![CDATA[<%= item.description %>]]></Description>
        <PicUrl><![CDATA[<%= item.picurl %>]]></PicUrl>
        <Url><![CDATA[<%= item.url %>]]></Url>
        </item>
        <% }) %>
        </Articles>
    <% } %>
    </xml>
 */});

var compiled = ejs.compile(tpl);

exports.compiled = function(message, replyContent) {
    var replyData = getReplyData(message, replyContent);
    return compiled(replyData);
};