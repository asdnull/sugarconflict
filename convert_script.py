#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to convert script_original.txt (JSON format) to script.txt (custom format)
用于将script_original.txt (JSON格式) 转换为script.txt (自定义格式)
"""

import json
import os
import sys

def parse_voice(voice_str, story_idx):
    """解析voice字段,返回VOICE_PLAY指令列表"""
    result = []
    if not voice_str:
        return result
    
    voices = voice_str.split(',')
    for idx, v in enumerate(voices):
        v = v.strip()
        if ':' in v:
            parts = v.split(':')
            voice_id = parts[1] if len(parts) > 1 else parts[0]
        else:
            voice_id = v
        result.append(f"<VOICE_PLAY>{idx},{voice_id}")
    
    return result

def convert_command_17(item, scene_name):
    """处理command 17 - 动画切换"""
    result = []
    anim = item.get('anim', '')
    if anim:
        result.append(f"<SPINE>{scene_name}$_spine,{scene_name},{scene_name},{anim},{scene_name}|10012,0,json")
        result.append(f"<SPINE_PLAY>{scene_name}$_spine,NONE,0,{anim},0,true,false")
        result.append(f"<SPINE_PLAY>{scene_name}$_spine,NONE,0,M1,1,true,false")
    return result

def convert_command_9(item):
    """处理command 9 - BGM播放"""
    target = item.get('target', '')
    if target:
        return [f"<BGM_PLAY>{target},0,"]
    return []

def convert_command_7(item):
    """处理command 7 - 淡入"""
    time_val = item.get('time', 0)
    time_ms = int(time_val * 1000)
    return [f"<FADE_IN2>white,{time_ms},1,0"]

def convert_command_5(item):
    """处理command 5 - 等待/淡出"""
    time_val = item.get('time', 0)
    time_ms = int(time_val * 1000)
    return [f"<WAIT2>{time_ms}"]

def convert_command_12(item):
    """处理command 12 - 缩放"""
    scale = item.get('scale', 1.0)
    args = item.get('args', '0.0,0.0')
    time_val = item.get('time', 0)
    time_ms = int(time_val * 1000)
    
    arg_parts = args.split(',')
    x = arg_parts[0].strip() if len(arg_parts) > 0 else '0.0'
    y = arg_parts[1].strip() if len(arg_parts) > 1 else '0.0'
    
    scale_int = int(scale) if scale == int(scale) else scale
    
    return [f"<ZOOM_ASYNC>{scale_int},{time_ms},{x},{y}"]

def convert_command_11(item, scene_name="1001"):
    """处理command 11 - 显示/隐藏"""
    target = item.get('target', '')
    if target == 'hide':
        return [f"<SPINE_STOP>{scene_name}$_spine,1,0"]
    elif target == 'show':
        return [f"<SPINE_PLAY>{scene_name}$_spine,NONE,0,M1,1,true,false"]
    return []

def convert_command_6(item, prev_voice_count):
    """处理command 6 - 对话"""
    result = []
    voice = item.get('voice', '')
    cName = item.get('cName', '')
    text = item.get('text', '')
    
    voices = voice.split(',') if voice else []
    current_voice_count = len([v for v in voices if v.strip()])
    
    if prev_voice_count > 0 and current_voice_count == 0:
        result.append("<VOICE_STOP>1")
    
    if voice:
        voice_parts = voice.split(',')
        for idx, v in enumerate(voice_parts):
            v = v.strip()
            if v:
                if ':' in v:
                    parts = v.split(':')
                    voice_id = parts[1] if len(parts) > 1 else parts[0]
                else:
                    voice_id = v
                result.append(f"<VOICE_PLAY>{idx},{voice_id}")
    
    result.append(f"<NAME_PLATE>{cName}")
    
    if text:
        # 转义换行符 \n 为 \\n
        escaped_text = text.replace('\n', '\\n')
        result.append(escaped_text)
    
    result.append("<PAUSE>")
    
    return result, current_voice_count

def convert_json_to_script(json_data, scene_name="1001"):
    """将JSON数据转换为自定义脚本格式"""
    result = []
    story_list = json_data.get('storyList', [])
    
    prev_voice_count = 0
    
    for item in story_list:
        command = item.get('command', 0)
        
        if command == 17:
            result.extend(convert_command_17(item, scene_name))
        elif command == 9:
            result.extend(convert_command_9(item))
        elif command == 7:
            result.extend(convert_command_7(item))
        elif command == 5:
            result.extend(convert_command_5(item))
        elif command == 12:
            result.extend(convert_command_12(item))
        elif command == 11:
            result.extend(convert_command_11(item, scene_name))
        elif command == 6:
            lines, prev_voice_count = convert_command_6(item, prev_voice_count)
            result.extend(lines)
    
    result.append("<BGM_STOP>500")
    result.append("<UI_DISP>OFF, 500")
    result.append("<BG_OUT>500")
    result.append("<SCENARIO_END>")
    
    # 不再加双引号和逗号，直接输出
    return '\n'.join(result)

def main():
    if len(sys.argv) > 1:
        input_path = sys.argv[1]
    else:
        input_path = "scenes/c1001/script_original.txt"
    
    if len(sys.argv) > 2:
        output_path = sys.argv[2]
    else:
        output_path = input_path.replace('_original.txt', '.txt')
    
    print(f"正在转换: {input_path}")
    print(f"输出到: {output_path}")
    
    with open(input_path, 'r', encoding='utf-8') as f:
        json_data = json.load(f)
    
    scene_name = json_data.get('m_Name', '1001')
    
    script_content = convert_json_to_script(json_data, scene_name)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(script_content)
    
    print("转换完成!")

if __name__ == "__main__":
    main()