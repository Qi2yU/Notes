package com.qy.notes.service.impl;

import com.qy.notes.mapper.StatisticMapper;
import com.qy.notes.model.base.ApiResponse;
import com.qy.notes.model.base.Pagination;
import com.qy.notes.model.dto.statistic.StatisticQueryParam;
import com.qy.notes.model.entity.Statistic;
import com.qy.notes.service.StatisticService;
import com.qy.notes.utils.ApiResponseUtil;
import com.qy.notes.utils.PaginationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatisticServiceImpl implements StatisticService {
    @Autowired
    private StatisticMapper statisticMapper;

    @Override
    public ApiResponse<List<Statistic>> getStatistic(StatisticQueryParam queryParam) {

        Integer page = queryParam.getPage();
        Integer pageSize = queryParam.getPageSize();
        int offset = PaginationUtils.calculateOffset(page, pageSize);
        int total = statisticMapper.countStatistic();

        Pagination pagination = new Pagination(page, pageSize, total);

        try {
            List<Statistic> statistics = statisticMapper.findByPage(pageSize, offset);
            return ApiResponseUtil.success("获取统计列表成功", statistics, pagination);
        } catch (Exception e) {
            return ApiResponseUtil.error(e.getMessage());
        }
    }
}
