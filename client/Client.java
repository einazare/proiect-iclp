import java.net.*;
import java.util.*;
import java.io.*;

public class Client {
  private String hostname;
  private int port;
  private String userName;

  public Client(String hostname, int port) {
    this.hostname = hostname;
    this.port = port;
  }

  public void execute() {
    try {
      Socket socket = new Socket(hostname, port);

      String url = "http://" + hostname + ":" + String.valueOf(port);
      System.out.println(url);
      String charset = "UTF-8";
      String message = "CREATE_ROOM room1 30";

      String query = String.format("message=%s", URLEncoder.encode(message, charset));

      System.out.println("Connected to the chat server");

      URLConnection connection = new URL(url).openConnection();
      connection.setDoOutput(true); // Triggers POST.
      connection.setRequestProperty("Accept-Charset", charset);
      connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=" + charset);
      try (OutputStream output = connection.getOutputStream()) {
        output.write(query.getBytes(charset));
      }
      
      InputStream response = connection.getInputStream();

      try (Scanner scanner = new Scanner(response)) {
        String responseBody = scanner.useDelimiter("\\A").next();
        System.out.println(responseBody);
      }

      // new ReadThread(socket, this).start();
      // new WriteThread(socket, this).start();

    } catch (UnknownHostException ex) {
      System.out.println("Server not found: " + ex.getMessage());
    } catch (IOException ex) {
      System.out.println("I/O Error: " + ex.getMessage());
    }

  }

  void setUserName(String userName) {
    this.userName = userName;
  }

  String getUserName() {
    return this.userName;
  }


  public static void main(String[] args) {
    if (args.length < 2) return;

    String hostname = args[0];
    int port = Integer.parseInt(args[1]);

    Client client = new Client(hostname, port);
    client.execute();
  }
}
