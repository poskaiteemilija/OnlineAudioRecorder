from pydub import AudioSegment
import subprocess



def convert_audio(source, selected_format, filename):
    webm_audio = AudioSegment.from_file(source)
    webm_audio.export(filename, format=selected_format)


#test_audio = AudioSegment.from_file("D:\\Bakalauras\\CE301_poskaite_emilija\\website\\backend\\r_5IsDWVB.webm")
#test_audio.export("test5.mp3", format="mp3")

#subprocess.run(['ffmpeg', '-i', "D:\\Bakalauras\\CE301_poskaite_emilija\\website\\backend\\r_gguWa6J.webm", "D:\\Bakalauras\\CE301_poskaite_emilija\\website\\backend\\test3.mp3"])

convert_audio("D:\\Bakalauras\\CE301_poskaite_emilija\\website\\backend\\r_5IsDWVB.webm", "mp3", "test6.mp3")