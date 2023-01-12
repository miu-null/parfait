const express = require("express");
const router = express.Router();
const Comment = require("./schema/comment.js");
const Parfait = require("./schema/post");
const {ObjectId} = require("mongoose").Types;

// // 댓글 조회하기

router.get("/", async (_, res) => {
    try {
        const comment = await Comment.find().select("-passcode");
        // passcode는 빼고 조회되어야 한다!
        res.json({data: comment});
        if (!comment) return res.json({message: "댓글이 없습니다."});
    } catch (error) {
        res.status(500).json({message: err.message});
    }
});

// 댓글쓰기
router.post("/:postId", async (req, res) => {
    const {postId} = req.params;
    // 어느 게시글에 쓸건지 postId로 확인

    const currentParfait = await Parfait.findById(postId);
    // 쓸 게시글이 없을때 에러 띄우기
    if (!currentParfait) return res.json({message: "댓글을 등록할 수 있는 파르페가 없습니다."});

    // if (!Object.keys(req.body).length) {
    //     return res.status(400).json({message: "댓글 형식이 올바르지 않습니다"});
    // }
    const {writer, comment, passcode} = req.body;
    if (!writer || !passcode || !comment) {
        return res.status(400).json({message: "필수 항목이 입력되지 않았습니다"});
        // 입력값 확인
    }

    try {
        const currentcomment = await Comment.create({
            writer,
            comment,
            passcode,
            postId,
        });
        res.json({data: currentcomment});
    } catch (error) {
        res.status(500).json({message: err.message});
    }
});

router.patch("/:Id", async (req, res) => {
    const {Id} = req.params;
    const {writer, comment, passcode} = req.body;

    const currentcomment = await Comment.findById(Id);
    if (!currentcomment) return res.json({message: "수정할 댓글이 없습니다."});

    const passcodematch = comment.passcode === passcode;
    if (passcodematch) {
        if (writer) {
            comment.writer = writer;
        }

        if (comment) {
            comment.comment = comment;
        }

        if (passcode) {
            comment.passcode = passcode;
        }

        try {
            const updatedcomment = await comment.save();
            res.json({data: updatedcomment});
        } catch (error) {
            res.status(500).json({message: err.message});
        }
    } else {
        res.json({message: "비밀번호가 맞지 않습니다."});
    }
});

router.delete("/:id", async (req, res) => {
    const {id} = req.params;
    const {passcode} = req.body;
    const delComment = await Comment.findById(id);
    console.log(delComment);
    if (!delComment) {
        return res.status(400).json({message: "삭제할 댓글을 발견하지 못했습니다."});
    }
    const deletepass = delComment.passcode === passcode;

    if (deletepass) {
        try {
            await delComment.remove();
            res.json({message: "댓글 삭제되었습니다."});
        } catch (error) {
            res.status(500).json({message: err.message});
        }
    } else {
        res.status(401).json({message: "비밀번호가 맞지 않습니다."});
    }
});

module.exports = router;
