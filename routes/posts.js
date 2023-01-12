const app = require("express");
const express = require("express");
const router = express.Router();
const Parfait = require("./schema/post");
const {ObjectId} = require("mongoose").Types;

router.get("/", async (_, res) => {
    try {
        const parfait = await Parfait.find().select("-passcode");
        // passcode는 빼고 조회되어야 한다!
        res.json({data: parfait});
        // if (!comment) return res.json({message: "댓글이 없습니다."});
    } catch (error) {
        res.status(500).json({message: err.message});
    }
});

router.post("/addnew", async (req, res) => {
    if (!Object.keys(req.body).length) {
        return res.status(400).json({message: "파르페 형식이 올바르지 않습니다"});
    }
    const {name, passcode, title, content} = req.body;
    if (!name || !passcode || !title || !content) {
        return res.status(400).json({message: "필수 항목이 입력되지 않았습니다"});
    }

    try {
        const parfait = await Parfait.create({
            name,
            passcode,
            title,
            content,
        });
        res.json({data: parfait});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

//상세조회
router.get("/:id?", async (req, res) => {
    try {
        const {id} = req.params;
        const catchParfait = await Parfait.findById(id).select(["-passcode"]);
        if (!req.params.id) {
            return res.json({message: "파르페 형식이 올바르지 않습니다."});
        } else res.json({data: catchParfait});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});
router.patch("/:id", async (req, res) => {
    const {id} = req.params;
    const isValid = ObjectId.isValid(id);
    // 몽고디비에서 자동 생성되는 형식을 오브젝트아이디라고 함!
    // isValid 함수는 파람으로 넘어온 아이디가
    // 몽고디비에서 자동 생성되는 오브젝트 아이디 형식과 같은지 검증
    // 그래야 아래 if절에서 검증을 해줄 수 있으니까! (틀린 케이스를 isValid함수를 통해 찾아냄)
    // 이게 없으면 우리가 원하는 메시지가 아닌 시스템 메시지가 호출됨!

    // let parseId;
    // try {
    //     parseId = JSON.parse(id);
    // } catch (error) {
    //     return res.json(error);
    // }
    // params & query 로 넘어오는 것은 다 JSON.parse 처리해 주쟈
    // 1. BODY 또는 params 값이 유효하지 않을 때
    // const something = !req.body || !parseId;

    if (!Object.keys(req.body).length || !isValid) {
        // if (something) {
        return res.status(400).json({message: "파르페 형식이 올바르지 않습니다"});
    }

    const {name, title, content, passcode} = req.body;
    const parfait = await Parfait.findById(id);
    // 2. id값에 일치하는 게시글이 없을 때 ->
    if (!parfait) {
        return res.json({message: "수정할 파르페가 존재하지 않습니다."});
    }

    const passcodematch = parfait.passcode === passcode;

    if (passcodematch) {
        if (name) {
            parfait.name = name;
        }
        if (title) {
            parfait.title = title;
        }
        if (content) {
            parfait.content = content;
        }

        try {
            const catchParfait = await parfait.save();
            res.json({data: catchParfait});
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    } else {
        res.status(401).json({message: " 비밀번호가 맞지 않습니다."});
    }
});
router.delete("/:id", async (req, res) => {
    const {id} = req.params;
    const {passcode} = req.body;
    const delParfait = await Parfait.findById(id);
    // 지울 게시글을 param, id로 찾는다.

    if (!delParfait) {
        return res.status(400).json({message: "삭제할 파르페를 발견하지 못했습니다."});
        // 지울 게시글을 찾지 못했을 때!
    }
    const deletepass = delParfait.passcode === passcode;

    if (deletepass) {
        try {
            await delParfait.remove();
            res.json({message: "파르페가 삭제되었습니다."});
        } catch (error) {
            res.status(500).json({message: err.message});
        }
    } else {
        res.status(401).json({message: "비밀번호가 맞지 않습니다."});
    }
});
module.exports = router;
