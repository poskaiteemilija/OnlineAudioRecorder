from pydub import AudioSegment

test_audio = AudioSegment.from_file("D:\\Bakalauras\\CE301_poskaite_emilija\\website\\backend\\untitled.mp3", format="mp3")

test_audio.export("test.wav", format="wav")