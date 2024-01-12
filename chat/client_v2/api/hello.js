export default function (req, res) {
    console.log('===hello===req', req.query);
    const { name } = req.query;
    res.status(200).json({
        code: 200,
        msg: 'hello! this is a test vercel serverless api',
        data: {
            name,
        },
    });
}
