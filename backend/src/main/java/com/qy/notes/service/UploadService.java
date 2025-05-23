package com.qy.notes.service;

import com.qy.notes.model.base.ApiResponse;
import com.qy.notes.model.vo.upload.ImageVO;
import org.springframework.web.multipart.MultipartFile;

public interface UploadService {
    /**
     * 上传图片
     */
    ApiResponse<ImageVO> uploadImage(MultipartFile file);
}