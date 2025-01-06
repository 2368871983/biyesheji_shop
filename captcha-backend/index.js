import express from 'express';
import { create } from 'svg - captcha';
const app = express();
const port = 3000;

// 定义获取图形验证码的接口
app.get('/captcha/image', (req, res) => {
  // 生成图形验证码
  const captcha = create({
    size: 4, // 验证码长度
    noise: 2, // 干扰线条的数量
    color: true // 验证码的字符是否有颜色，默认没有
  });

  // 将验证码文本存储在会话或数据库中（这里简单演示，实际应用中应妥善存储）
  req.session.captcha = captcha.text;

  // 设置响应头为图像类型，并返回验证码图像数据
  res.type('svg');
  res.status(200).send(captcha.data);
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});