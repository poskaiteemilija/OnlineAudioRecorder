from pydub import *
import subprocess


def convert_audio(sources, selected_format, filename):
    print(sources, "***********************************************")
    print(sources[0].audio_file.path)
    main_audio = AudioSegment.from_file(sources[0].audio_file.path)
    print(main_audio, "this is main audio +++++++++++++++++++++++++++++++++")
    main_length = len(main_audio)
    if(len(sources) >= 2):
        for i in range(1, len(sources)):
            temp_audio = AudioSegment.from_file(sources[i].audio_file.path)
            if(main_length<len(temp_audio)):
                main_audio = main_audio[:len(main_audio)] + AudioSegment.silent(len(temp_audio)-main_length)
                main_length = len(main_audio)
            main_audio = main_audio.overlay(temp_audio)
    main_audio.export(filename, format=selected_format)


#test_audio = AudioSegment.from_file("D:\\Bakalauras\\CE301_poskaite_emilija\\website\\backend\\r_5IsDWVB.webm")
#test_audio.export("test5.mp3", format="mp3")

#subprocess.run(['ffmpeg', '-i', "D:\\Bakalauras\\CE301_poskaite_emilija\\website\\backend\\r_gguWa6J.webm", "D:\\Bakalauras\\CE301_poskaite_emilija\\website\\backend\\test3.mp3"])

#convert_audio("D:\\Bakalauras\\CE301_poskaite_emilija\\website\\backend\\r_5IsDWVB.webm", "mp3", "test6.mp3")