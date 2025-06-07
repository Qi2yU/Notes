package com.qy.notes.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@Configuration// 修改为正确的Mapper包路径
@MapperScan("com.qy.notes.mapper")
@EnableTransactionManagement
public class MyBatisConfig {
}
