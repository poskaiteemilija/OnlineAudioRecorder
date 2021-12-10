from pydub import AudioSegment
import subprocess



test_audio = AudioSegment.from_file("D:\\Bakalauras\\CE301_poskaite_emilija\\website\\backend\\r_5IsDWVB.webm")

test_audio.export("test5.mp3", format="mp3")

#subprocess.run(['ffmpeg', '-i', "D:\\Bakalauras\\CE301_poskaite_emilija\\website\\backend\\r_gguWa6J.webm", "D:\\Bakalauras\\CE301_poskaite_emilija\\website\\backend\\test3.mp3"])