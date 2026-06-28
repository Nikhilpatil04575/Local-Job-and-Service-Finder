package com.locjob.pojo;

import java.util.HashMap;
import java.util.Map;

public class ResponsePojo {

	private String status;
	private String msg;
	private Object obj;
	Map<String, Object> responseMap = new HashMap<String,Object>();
	
	public ResponsePojo() {
		
	}
	
	public ResponsePojo(String status, String msg, Map<String, Object> responseMap) {
		super();
		this.status = status;
		this.msg = msg;
		this.responseMap = responseMap;
	}
	
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public Map<String, Object> getResponseMap() {
		return responseMap;
	}
	public void setResponseMap(Map<String, Object> responseMap) {
		this.responseMap = responseMap;
	}
	
	public Object getObj() {
		return obj;
	}
	public void setObj(Object obj) {
		this.obj = obj;
	}
	
	@Override
	public String toString() {
		return "ResponsePojo [status=" + status + ", msg=" + msg + ", obj=" + obj + ", responseMap=" + responseMap + "]";
	} 
	
	
}
