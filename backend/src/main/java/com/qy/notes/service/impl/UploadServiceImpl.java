package com.qy.notes.service.impl;

import com.qy.notes.model.base.ApiResponse;
import com.qy.notes.model.vo.upload.ImageVO;
import com.qy.notes.service.FileService;
import com.qy.notes.service.UploadService;
import com.qy.notes.utils.ApiResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadServiceImpl implements UploadService {

    @Autowired
    FileService fileService;

    @Override
    public ApiResponse<ImageVO> uploadImage(MultipartFile file) {
        String url = fileService.uploadImage(file);
        ImageVO imageVO = new ImageVO();
        imageVO.setUrl(url);
        return ApiResponseUtil.success("上传成功", imageVO);
    }
}